import { queryClient, useTask } from "@/api";
import { Draggable } from "@hello-pangea/dnd";
import { ComponentPropsWithRef, useEffect, useState } from "react";
import { cn } from "@/utils";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TaskProps = {
  id: string;
  index: number;
} & ComponentPropsWithRef<"div">;

const Task = ({ id, index, ...props }: TaskProps) => {
  const { task, taskUpdatedAt } = useTask.get(id);
  const { updateTask, isUpdatingTask } = useTask.update(id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [taskUpdatedAt]);

  useEffect(() => {
    if (!isEditing && changed) {
      updateTask(
        {
          id,
          payload: {
            title,
            description,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", id] });
            setChanged(false);
          },
        },
      );
      setChanged(false);
    }
  }, [isEditing, changed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing]);

  const handleEnterEditMode = () => {
    setIsEditing(true);
  };

  const handleExitEnterMode = () => {
    setIsEditing(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setChanged(true);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value);
    setChanged(true);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          id={id}
          ref={provided.innerRef}
          className={cn(
            "flex flex-col my-1 border-stone-300 dark:border-stone-700 border-[1px] p-2 rounded bg-white dark:bg-stone-800 hover:cursor-grab relative group",
            isEditing && "border-blue-700 dark:border-blue-300",
          )}
          // onFocus={handleEnterEditMode}
          // onBlur={handleExitEnterMode}
          {...props}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {!isEditing ? (
            <span className="font-bold text-foreground select-none">
              {title}
            </span>
          ) : (
            <input
              className="bg-transparent border-none outline-none font-bold text-foreground"
              value={title}
              onChange={handleTitleChange}
              disabled={isUpdatingTask}
            />
          )}
          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              className="hidden absolute w-7 h-7 right-2 group-hover:flex"
              onClick={handleEnterEditMode}
            >
              <PencilIcon size={12} />
            </Button>
          )}
          {/* {isEditing && description.length === 0 && (
            <textarea
              className="bg-transparent border-none outline-none text-foreground"
              value={description}
              placeholder="Add a description"
              onChange={handleDescriptionChange}
              disabled={isUpdatingTask}
            />
          )} */}
          <span>{task?.description}</span>
        </div>
      )}
    </Draggable>
  );
};

export default Task;

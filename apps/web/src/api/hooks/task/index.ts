import { getAll } from './getAll';
import { get } from './get';
import { create } from './create';
import { update } from './update';
import { reorder } from './reorder';
import { deleteTask } from './delete';

export default { getAll, get, create, update, reorder, delete: deleteTask };

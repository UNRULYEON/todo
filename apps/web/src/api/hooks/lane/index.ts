import { getAll } from './getAll';
import { get } from './get';
import { getTasks } from './getTasks';
import { create } from './create';
import { update } from './update';
import { deleteLane } from './delete';

export default { getAll, get, getTasks, create, update, delete: deleteLane };

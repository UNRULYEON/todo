import { getAll } from './getAll';
import { get } from './get';
import { create } from './create';
import { update } from './update';
import { deleteLane } from './delete';

export default { getAll, get, create, update, delete: deleteLane };

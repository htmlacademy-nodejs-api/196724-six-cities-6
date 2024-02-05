import { User } from '../../types/index.js';

// ⚠⚠⚠ Question. I do not see any benefits of using a class for CreateUserDto.
// In my view, an interface is an eser way in here.
// In most of the cases it can extend just return data type.
// So why Academy recommends class using for dto?
export interface CreateUserDto extends User {}

import { map, OperatorFunction } from 'rxjs';

export function mapVoid(): OperatorFunction<unknown, void> {
   return map(() => undefined);
}

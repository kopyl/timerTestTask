
import { Observable } from 'rxjs';

type Tuple<A, B=A> = [A, B]
export type doubleClicks = Observable<Tuple<MouseEvent>>

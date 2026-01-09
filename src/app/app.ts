import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Todo } from './models/todo.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  randomTodo$!: Observable<Todo>;
  @ViewChild('randomBtn', { static: false })
  randomBtn!: ElementRef<HTMLButtonElement>;

  protected readonly title = signal('angular-task-3-rxjs-http');

  private counterSubject = new BehaviorSubject<number>(1);
  counter$ = this.counterSubject.asObservable();

  todos$!: Observable<Todo[]>;
  counterTodo$!: Observable<Todo>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.todos$ = this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        map(todos => todos.filter(todo => todo.id % 2 === 0))
      );

      this.counterTodo$ = this.counter$.pipe(
        switchMap(id =>
          this.http.get<Todo>(
            `https://jsonplaceholder.typicode.com/todos/${id}`
          )
        )
      );      
  }

  ngAfterViewInit() {
    this.randomTodo$ = fromEvent(this.randomBtn.nativeElement, 'click').pipe(
      map(() => Math.floor(Math.random() * 200) + 1),
      switchMap(id =>
        this.http.get<Todo>(
          `https://jsonplaceholder.typicode.com/todos/${id}`
        )
      )
    );
  }

  increment() {
    this.counterSubject.next(this.counterSubject.value + 1);
  }
  
  decrement() {
    if (this.counterSubject.value > 1) {
      this.counterSubject.next(this.counterSubject.value - 1);
    }
  }
}


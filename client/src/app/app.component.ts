import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Coordinate {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  grid: number[][] = Array(20)
    .fill(0)
    .map(() => Array(20).fill(0));
  start: Coordinate | null = null;
  end: Coordinate | null = null;
  path: Coordinate[] = [];

  constructor(private http: HttpClient) {}

  onClickTile(x: number, y: number) {
    if (!this.start) {
      this.start = { x, y };
    } else if (!this.end) {
      this.end = { x, y };
    }
  }

  startPointCell(x: number, y: number): boolean | null {
    return this.start && this.start.x === x && this.start.y === y;
  }

  endPointCell(x: number, y: number): boolean | null {
    return this.end && this.end.x === x && this.end.y === y;
  }

  pathCell(x: number, y: number): boolean {
    return this.path.some((coord) => coord.x === x && coord.y === y);
  }


  findShortestPath() {
    if (this.start && this.end) {
      const payload = { start: this.start, end: this.end };
      console.log('payload: ', payload);
      this.http
        .post<Coordinate[]>('http://localhost:3000/shortest-path', payload)
        .subscribe(
          (response: Coordinate[]) => {
            this.path = response;
          },
          (error) => {
            console.error('Unable to find shortest path', error);
          }
        );
    }
  }

  clear() {
    this.start = null;
    this.end = null;
    this.path = [];
  }
}

import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  trigger,
  transition,
  style,
  animate,
  query,
} from "@angular/animations";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  animations: [
    trigger("routeFade", [
      transition("* <=> *", [
        query(
          ":leave",
          [
            style({ opacity: 1 }),
            animate("150ms ease-out", style({ opacity: 0 })),
          ],
          { optional: true },
        ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            animate("250ms ease-in", style({ opacity: 1 })),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
  template: `
    <div style="min-height:100vh">
      <router-outlet #outlet="outlet" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AppComponent {}

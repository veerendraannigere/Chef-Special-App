import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// import FilterPipe from "./filter.Pipe";
import { EllipsisPipe } from './ellipsis';

@NgModule({
    declarations: [EllipsisPipe],
    imports: [CommonModule],
    exports: [EllipsisPipe]
})

export class MainPipe { }
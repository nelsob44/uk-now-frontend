import { NgModule }      from '@angular/core';
import { SanitizeHtmlPipe } from 'src/app/sanitize-html.pipe';
 
 @NgModule({
     declarations: [SanitizeHtmlPipe],
     exports: [SanitizeHtmlPipe],
 })

 export class PipeModule {

   static forRoot() {
      return {
          ngModule: PipeModule,
          providers: [],
      };
   }
 } 
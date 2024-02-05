import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GenerateComponent } from './components/generate/generate.component';
import { ScreenComponent } from './components/screen/screen.component';
import { AssistantComponent } from './components/assistant/assistant.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'generate', component: GenerateComponent},
  {path: 'screen', component: ScreenComponent},
  {path: 'assistant', component: AssistantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

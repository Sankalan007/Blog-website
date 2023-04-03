import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostdetailComponent } from './components/postdetail/postdetail.component';
import { PostsComponent } from './components/posts/posts.component';
import { UserblogsComponent } from './components/userblogs/userblogs.component';
import { TermsandconditionsComponent } from './components/termsandconditions/termsandconditions.component';
import { UseraccountComponent } from './components/useraccount/useraccount.component';

const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'posts/:id', component: PostdetailComponent },
  { path: 'myblogs', component: UserblogsComponent },
  { path: 'terms', component: TermsandconditionsComponent },
  { path: 'myaccount', component: UseraccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

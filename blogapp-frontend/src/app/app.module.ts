import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostsComponent } from './components/posts/posts.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostdetailComponent } from './components/postdetail/postdetail.component';
import { UserblogsComponent } from './components/userblogs/userblogs.component';
import { TermsandconditionsComponent } from './components/termsandconditions/termsandconditions.component';
import { UseraccountComponent } from './components/useraccount/useraccount.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsComponent,
    LoginComponent,
    RegisterComponent,
    PostdetailComponent,
    UserblogsComponent,
    TermsandconditionsComponent,
    UseraccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

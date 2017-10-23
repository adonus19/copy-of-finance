import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ExpenseService } from '../../services/expense.service'


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  /*
  category: String;
  amount: Number;
  date: Date;
  */
  public amount = '';
  public category = '';
  public datepickerModel = '';
  public list = {entries:[]};
  
  constructor(
    private flashMessage: FlashMessagesService,
    private expenseService: ExpenseService 
  ) {
    let amountsString = localStorage.getItem('budget');
    if (amountsString) {
      this.list = JSON.parse(amountsString);
    }
   }

  ngOnInit() {
  }

  onExpenseSubmit() {
    let newEntry = {datepickerModel: this.datepickerModel, amount: parseFloat(this.amount).toFixed(2), category: this.category};
    let list = {entries: []};
    let amountsString = localStorage.getItem('budget');
    if (amountsString) { list = JSON.parse(amountsString); }
    list.entries.unshift(newEntry);
    localStorage.setItem('budget', JSON.stringify(list));
    this.list.entries.unshift(newEntry);
    
    //send user expense
    let user = JSON.parse(localStorage.getItem('user'));
    let entry = {
      id: user.id,
      expense: newEntry
    }
    this.expenseService.sendExpense(entry).subscribe(data => {
      console.log(entry)
      if (data.success) {
        this.flashMessage.show('Updated', {cssClass: 'alert-success', timeout: 4000});
      } else {
        this.flashMessage.show('Oh snap! Something happened. Please try again!', {cssClass: 'alert-danger', timeout: 6000});
      }
    });
    this.amount = '';
    this.category = '';
    this.datepickerModel = '';
  }
}
  /*
  onExpenseSubmit() {
    const user = {
      category: this.category,
      amount: this.amount,
      date: this.date
    }  */


    


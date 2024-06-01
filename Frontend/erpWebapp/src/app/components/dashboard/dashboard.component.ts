import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { PedidosService } from 'src/app/pedido.service';
import { Pedidos } from 'src/pedidos';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public pedido: Pedidos[] = []
  vendas!: number | any;
  numPedidos!: number | any;
  novosClientes!: number | any;
  titulosVencidos!: number;
  vendasHoje!: number;
  pedidosHoje!: number;

  constructor(private pedidosService : PedidosService ){}

  ngOnInit(): void {
    this.vendas = this.getTotalMes();
    this.numPedidos = this.getPedidoMes();
    this.novosClientes = this.getClienteMes();
    this.titulosVencidos = this.getRandomNumber(1, 10);
    this.vendasHoje = this.getRandomNumber(100, 500);
    this.pedidosHoje = this.getRandomNumber(10, 50);



    this.generateSalesChart();
  }

  public getTotalMes():any{
    this.pedidosService.getTotalMes().subscribe(
      (response : Pedidos[]) => {
          this.vendas = response;
      }, (error: HttpErrorResponse) => {alert(error.message)}
      ) 
       
}

public getPedidoMes():any{
  this.pedidosService.getPedidoMes().subscribe(
    (response : Pedidos[]) => {
        this.numPedidos = response;
    }, (error: HttpErrorResponse) => {alert(error.message)}
    ) 
     
}

public getClienteMes():any{
  this.pedidosService.getClienteMes().subscribe(
    (response : Pedidos[]) => {
        this.novosClientes = response;
    }, (error: HttpErrorResponse) => {alert(error.message)}
    ) 
     
}

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateSalesChart(): void {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const salesData = [];
    const ordersData = [];
    for (let i = 0; i < 7; i++) {
      if (i == 6){
        console.log("o valor de i é: " + i)
        salesData.push(this.vendasHoje);
        ordersData.push(this.pedidosHoje);
        }else{
      salesData.push(this.getRandomNumber(100, 1000));
      ordersData.push(this.getRandomNumber(10, 80));
        }
    }

    // Atualizar o gráfico  Chart.js
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Vendas Diárias',
            data: salesData,
            backgroundColor: 'rgba(28, 245, 93, 0.596)',
            borderColor: 'rgba(28, 245, 93, 0.596)',
            borderWidth: 1
          },
          {
            label: 'Pedidos Diários',
            data: ordersData,
            backgroundColor: 'rgba(16, 134, 224, 0.596)',
            borderColor: 'rgba(16, 134, 224, 0.596)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }


}

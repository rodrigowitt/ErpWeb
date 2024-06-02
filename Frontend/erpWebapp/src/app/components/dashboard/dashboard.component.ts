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
  vendasHoje!: number | any;
  pedidosHoje!: number | any;

  constructor(private pedidosService : PedidosService ){}

  ngOnInit(): void {
    this.vendas = this.getTotalMes();
    this.numPedidos = this.getPedidoMes();
    this.novosClientes = this.getClienteMes();
    this.titulosVencidos = this.getRandomNumber(1, 10);
    this.vendasHoje = this.getTotalDia();
    this.pedidosHoje = this.getPedidoDia();



    this.generateSalesChart();
  }

  public getTotalMes():any{
    this.pedidosService.getTotalMes().subscribe(
      (response : Pedidos[]) => {
          this.vendas = response;
      }, (error: HttpErrorResponse) => {alert(error.message)}
      ) 
       
}

public getTotalDia():any{
  this.pedidosService.getTotalDia().subscribe(
    (response : Pedidos[]) => {
        this.vendasHoje = response;
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

public getPedidoDia():any{
  this.pedidosService.getPedidoDia().subscribe(
    (response : Pedidos[]) => {
        this.pedidosHoje = response;
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
    this.pedidosService.getVendasSemana().subscribe((data: Pedidos[]) => {
      const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      const salesData = new Array(7).fill(0);

      data.forEach(item => {
        const date = new Date(item.date);
        const dayOfWeek = (date.getDay() + 7) % 7; // Ajuste para começar de segunda-feira
        salesData[dayOfWeek] = item.total;
        console.log("salesdata é " + salesData)
      });

      // Atualizar o gráfico Chart.js
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
    });
  }


}

import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendas!: number;
  numPedidos!: number;
  novosClientes!: number;
  titulosVencidos!: number;
  vendasHoje!: number;
  pedidosHoje!: number;

  constructor() { }

  ngOnInit(): void {
    this.vendas = this.getRandomNumber(1000, 10000);
    this.numPedidos = this.getRandomNumber(50, 200);
    this.novosClientes = this.getRandomNumber(5, 20);
    this.titulosVencidos = this.getRandomNumber(1, 10);
    this.vendasHoje = this.getRandomNumber(100, 500);
    this.pedidosHoje = this.getRandomNumber(10, 50);


    this.generateSalesChart();
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateSalesChart(): void {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const salesData = [];
    const ordersData = [];
    for (let i = 0; i < 7; i++) {
      salesData.push(this.getRandomNumber(50, 200));
      ordersData.push(this.getRandomNumber(10, 30));
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
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Pedidos Diários',
            data: ordersData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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

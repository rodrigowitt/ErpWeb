export interface Pedidos {
    date: string | number | Date;
    pedidoid: number;
    entrada: string;
    cliente: string;
    desconto: number;
    total: number;
    forma_pagamento: string;
    status: string;
}
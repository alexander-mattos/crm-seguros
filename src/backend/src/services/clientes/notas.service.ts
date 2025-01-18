import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { INota } from '../../shared/types/notas.types';
import { PrismaClient } from '@prisma/client';

@Injectable({
    providedIn: 'root'
})

export class NotasService {
    private prisma = new PrismaClient();
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    criarNota(clienteId: string, notasData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/notas/${clienteId}`, {
            ...notasData,
            clienteId: clienteId
        });
    }

    listarNotas(clienteId: number): Observable<INota[]> {
        return this.http.get<INota[]>(`${this.apiUrl}/telefones/${clienteId}`);
    }

    excluirTelefone(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Certifique-se de desconectar o Prisma Client após o uso, para evitar vazamentos de conexão
    ngOnDestroy() {
        this.prisma.$disconnect()
            .catch((e) => {
                console.error(e)
            })
    }
}
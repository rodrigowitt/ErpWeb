package com.ErpWeb.control;

import com.ErpWeb.dto.ItensPedidoDto;
import com.ErpWeb.dto.ProdutoDto;
import com.ErpWeb.model.ItensPedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.services.ItensPedidoServico;
import com.ErpWeb.services.ProdutoServico;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/itenspedido")
public class ItensPedidoControle {
    @Autowired
    private ItensPedidoServico itensPedidoServico;
    @Autowired
    ProdutoServico produtoServico;


    @PostMapping
    public ResponseEntity<Object> saveItensPedido(
            @RequestBody @Valid ItensPedidoDto itensPedidoDto) {
        // Buscar o produto com base no ID fornecido no DTO de itens de pedido
        Optional<ProdutoModelo> produtoOptional = produtoServico.findById(itensPedidoDto.getproduto_id());

        // Verificar se o produto foi encontrado
        if (!produtoOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado");
        }

        // Extrair o modelo de produto do Optional
        ProdutoModelo produto = produtoOptional.get();

        // Definir o nome do produto no DTO
        itensPedidoDto.setProduto(produto.getNome());

        // Criar um novo modelo de itens de pedido
        ItensPedidoModelo itensPedidoModelo = new ItensPedidoModelo();

        // Copiar os atributos do DTO para o modelo de itens de pedido
        BeanUtils.copyProperties(itensPedidoDto, itensPedidoModelo);

        // Definir o modelo de produto no modelo de itens de pedido
        itensPedidoModelo.setProdutoModelo(produto);

        // Salvar o modelo de itens de pedido
        ItensPedidoModelo savedItem = itensPedidoServico.save(itensPedidoModelo);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }





    @GetMapping
    public ResponseEntity<List<ItensPedidoModelo>> todosItensPedidos(){
        return ResponseEntity.status(HttpStatus.OK).body(itensPedidoServico.findAll());
    }



    @PutMapping("/{pedido}")
    public ResponseEntity<Object> editarItensPedido(@PathVariable(value = "pedido") Long pedidoId, @RequestBody @Valid List<ItensPedidoDto> itensPedidoDtoList) {
        // Buscar todos os itens de pedido associados ao pedido fornecido
        List<ItensPedidoModelo> itensPedidoModeloList = itensPedidoServico.findByPedido(pedidoId);

        // Criar um mapa para armazenar os itens existentes usando o produto_id como chave
        Map<Long, ItensPedidoModelo> itensExistentesMap = new HashMap<>();
        for (ItensPedidoModelo itemExistente : itensPedidoModeloList) {
            itensExistentesMap.put(itemExistente.getProduto_id(), itemExistente);
        }

        // Iterar sobre os itens de pedido do DTO recebidos na requisição
        for (ItensPedidoDto itensPedidoDto : itensPedidoDtoList) {
            // Verificar se o item de pedido tem um ID válido (produto_id)
            if (itensPedidoDto.getproduto_id() != null) {
                // Encontrar o item de pedido correspondente na lista de itens existentes
                ItensPedidoModelo itemExistente = itensExistentesMap.get(itensPedidoDto.getproduto_id());
                if (itemExistente != null) {
                    // Atualizar as propriedades do item existente com base no DTO recebido
                    BeanUtils.copyProperties(itensPedidoDto, itemExistente);
                    itensPedidoServico.save(itemExistente);
                } else {
                    // Se o item de pedido não existir na lista de itens existentes, é um novo item que deve ser adicionado
                    ItensPedidoModelo novoItemPedido = new ItensPedidoModelo();
                    // Copiar as propriedades do DTO para o novo item de pedido
                    BeanUtils.copyProperties(itensPedidoDto, novoItemPedido);
                    // Associar o novo item ao pedido existente
                    novoItemPedido.setPedido(pedidoId);
                    novoItemPedido.setProdutoModelo(novoItemPedido.getProdutoModelo());
                    System.out.println("nome do produto é : " + novoItemPedido.getProdutoModelo());
                    itensPedidoServico.save(novoItemPedido);
                }
            }
        }

        // Retornar uma resposta de sucesso com a lista de itens de pedido atualizados
        return ResponseEntity.ok("");
    }
















    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarPedido(@PathVariable(value = "id")Long id){
        Optional<ItensPedidoModelo> itensPedidoModeloOptional = itensPedidoServico.findById(id);
        if (!itensPedidoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro de item não encontrado");
        }else {
            itensPedidoServico.delete(itensPedidoModeloOptional.get());
            return  ResponseEntity.status(HttpStatus.OK).body("Item de Pedido Deletado!");
        }
    }

    @GetMapping(value = "/{pedido}")
    public ResponseEntity<List<ItensPedidoModelo>> getIdItenspedido(@PathVariable(value = "pedido") Long pedido){

        return ResponseEntity.status(HttpStatus.OK).body(itensPedidoServico.findByPedido(pedido));
    }



}

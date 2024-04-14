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

    @PutMapping("/{id}")
    public ResponseEntity<Object> editarItemPedido(@PathVariable(value = "id")Long id, @RequestBody @Valid ItensPedidoDto itensPedidoDto){

        Optional<ItensPedidoModelo> itemPedidoModeloOptional = itensPedidoServico.findById(id);

        if (!itemPedidoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        var itensPedidoModelo = itemPedidoModeloOptional.get();

        BeanUtils.copyProperties(itensPedidoDto, itensPedidoModelo);

        itensPedidoModelo.setItensPedidoid(itemPedidoModeloOptional.get().getItensPedidoid());

        return ResponseEntity.status(HttpStatus.OK).body(itensPedidoServico.save(itensPedidoModelo));
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

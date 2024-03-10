package com.ErpWeb.control;

import com.ErpWeb.dto.ItensPedidoDto;
import com.ErpWeb.dto.PedidoDto;
import com.ErpWeb.dto.ProdutoDto;
import com.ErpWeb.model.ItensPedidoModelo;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.services.ItensPedidoServico;
import com.ErpWeb.services.PedidoServico;
import com.ErpWeb.services.ProdutoServico;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
            @RequestBody
            @Valid
            ItensPedidoDto itensPedidoDto, ProdutoDto produtoDto){
        Optional<ProdutoModelo> produtoModelo = produtoServico.findById(itensPedidoDto.getproduto_id());
        var itensPedidoModelo = new ItensPedidoModelo();

        itensPedidoDto.setProduto(produtoModelo.get().getNome());
        System.out.println("setando nome de produto de itens de pedido: " + produtoModelo.get().getNome() );

        BeanUtils.copyProperties(itensPedidoDto, itensPedidoModelo);


        return ResponseEntity.status(HttpStatus.CREATED).body(itensPedidoServico.save(itensPedidoModelo));
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
}

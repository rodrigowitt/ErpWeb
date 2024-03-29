package com.ErpWeb.control;

import com.ErpWeb.dto.PedidoDto;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.services.PedidoServico;
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
@RequestMapping("/pedido")
public class PedidoControle {
    @Autowired
    private PedidoServico pedidoServico;

    public PedidoControle(PedidoServico pedidoServico) {
        this.pedidoServico = pedidoServico;
    }
    @PostMapping
    public ResponseEntity<Object> savePedido(
            @RequestBody
            @Valid
            PedidoDto pedidoDto){
        var pedidoModelo = new PedidoModelo();
        BeanUtils.copyProperties(pedidoDto, pedidoModelo);
        pedidoModelo.setEntrada(LocalDateTime.from(LocalDateTime.now()));

        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoServico.save(pedidoModelo));
    }
    @GetMapping
    public ResponseEntity<List<PedidoModelo>> todosPedidos(){
        return ResponseEntity.status(HttpStatus.OK).body(pedidoServico.findAll());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Object> editarPedido(@PathVariable(value = "id")Long id, @RequestBody @Valid PedidoDto pedidoDto){

        Optional<PedidoModelo> pedidoModeloOptional = pedidoServico.findById(id);

        if (!pedidoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        var pedidoModelo = pedidoModeloOptional.get();

        BeanUtils.copyProperties(pedidoDto, pedidoModelo);

        pedidoModelo.setPedidoid(pedidoModeloOptional.get().getPedidoid());

        return ResponseEntity.status(HttpStatus.OK).body(pedidoServico.save(pedidoModelo));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarPedido(@PathVariable(value = "id")Long id){
        Optional<PedidoModelo> pedidoModeloOptional = pedidoServico.findById(id);
        if (!pedidoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else {
            pedidoServico.delete(pedidoModeloOptional.get());
            return  ResponseEntity.status(HttpStatus.OK).body("Pedido Deletado!");
        }



    }


    @GetMapping(value = "/buscar/{pedido}/{cliente}")
    public ResponseEntity<List<PedidoModelo>> buscarPedidos(@PathVariable (value = "pedido") String numeroPedido,@PathVariable(value = "cliente") String numeroCliente){
        return ResponseEntity.status(HttpStatus.OK).body(pedidoServico.findBySearch(numeroPedido, numeroCliente));
    }


}

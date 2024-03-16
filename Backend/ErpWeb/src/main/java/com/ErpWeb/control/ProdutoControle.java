package com.ErpWeb.control;

import com.ErpWeb.dto.PedidoDto;
import com.ErpWeb.dto.ProdutoDto;
import com.ErpWeb.model.PedidoModelo;
import com.ErpWeb.model.ProdutoModelo;
import com.ErpWeb.services.PedidoServico;
import com.ErpWeb.services.ProdutoServico;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/produto")
public class ProdutoControle {

    @Autowired
    private ProdutoServico produtoServico;

    public ProdutoControle(PedidoServico pedidoServico){ this.produtoServico = produtoServico;}

    @PostMapping
    public ResponseEntity<Object> saveProduto(
            @RequestBody
            @Valid
            ProdutoDto produtoDto){
        var produtoModelo = new ProdutoModelo();
        BeanUtils.copyProperties(produtoDto, produtoModelo);
        produtoModelo.setEntrada(LocalDateTime.from(LocalDateTime.now()));

        return ResponseEntity.status(HttpStatus.CREATED).body(produtoServico.save(produtoModelo));
    }

    @GetMapping
    public ResponseEntity<List<ProdutoModelo>> todosProdutos(){
        return ResponseEntity.status(HttpStatus.OK).body(produtoServico.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> editarProduto(@PathVariable(value = "id")Long id, @RequestBody @Valid ProdutoDto produtoDto){

        Optional<ProdutoModelo> produtoModeloOptional = produtoServico.findById(id);

        if (!produtoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }
        var produtoModelo = produtoModeloOptional.get();

        BeanUtils.copyProperties(produtoDto, produtoModelo);

        produtoModelo.setProdutoid(produtoModeloOptional.get().getProdutoid());

        return ResponseEntity.status(HttpStatus.OK).body(produtoServico.save(produtoModelo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarProduto(@PathVariable(value = "id")Long id){
        Optional<ProdutoModelo> produtoModeloOptional = produtoServico.findById(id);
        if (!produtoModeloOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Registro não encontrado");
        }else {
            produtoServico.delete(produtoModeloOptional.get());
            return  ResponseEntity.status(HttpStatus.OK).body("Produto Deletado!");
        }
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Object> getIdProduto(@PathVariable(value = "id") Long id){
        Optional<ProdutoModelo> produtoModeloOptional = produtoServico.findById(id);
        if (!produtoModeloOptional.isPresent()){
            return  ResponseEntity.status(HttpStatus.OK).body(new HashMap<>());
        }
        return ResponseEntity.status(HttpStatus.OK).body(produtoModeloOptional.get());
    }
}

from django.db import models
from .listagem import Listagem
from .estado_conservacao import EstadoConservacao
from .piso import Piso
from .condicoes_pagamento import CondicoesPagamento
from .taxas_adicionais import TaxasAdicionais

class CaracteristicasGerais(models.Model):
    id = models.AutoField(primary_key=True)

    fk_listagem = models.ForeignKey(Listagem, on_delete=models.CASCADE)

    area_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    area_util = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    numero_quartos = models.IntegerField(null=True, blank=True)
    numero_suites = models.IntegerField(null=True, blank=True)
    numero_casas_banho = models.IntegerField(null=True, blank=True)
    numero_salas = models.IntegerField(null=True, blank=True)
    numero_cozinhas = models.IntegerField(null=True, blank=True)
    numero_vagas_estacionamento = models.IntegerField(null=True, blank=True)
    ano_construcao = models.IntegerField(null=True, blank=True)

    fk_estado_conservacao = models.ForeignKey(EstadoConservacao, on_delete=models.CASCADE, null=True, blank=True)
    fk_piso = models.ForeignKey(Piso, on_delete=models.CASCADE, null=True, blank=True)
    fk_condicoes_pagamento = models.ForeignKey(CondicoesPagamento, on_delete=models.CASCADE, null=True, blank=True)
    fk_taxas_adicionais = models.ForeignKey(TaxasAdicionais, on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        db_table = "tbl_caracteristicas_gerais"
        
    def __str__(self):
        return f"Características #{self.id}"
from django.db import models

class CondicoesPagamento(models.Model):
    id = models.AutoField(primary_key=True)
    condicoes_pagamento = models.CharField(max_length=50)

    class Meta:
        db_table = "tbl_condicoes_pagamento"
        
    def __str__(self):
        return self.condicoes_pagamento
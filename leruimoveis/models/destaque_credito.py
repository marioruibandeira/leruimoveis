from django.db import models


class DestaqueCredito(models.Model):
    destaque_credito_id = models.AutoField(primary_key=True)
    fk_agencia = models.ForeignKey('leruimoveis.Agencia', on_delete=models.CASCADE, related_name='destaque_creditos')
    fk_parceiro = models.ForeignKey('leruimoveis.Parceiro', on_delete=models.SET_NULL, null=True, blank=True, related_name='destaque_creditos')
    fk_plano_destaque = models.ForeignKey('leruimoveis.PlanoDestaque', on_delete=models.PROTECT, related_name='destaque_creditos')
    motivo = models.CharField(max_length=100, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    valido_ate = models.DateField(null=True, blank=True)
    usado_em = models.DateTimeField(null=True, blank=True)
    fk_destaque = models.OneToOneField('leruimoveis.Destaque_Listagem', on_delete=models.SET_NULL, null=True, blank=True, related_name='credito')

    class Meta:
        db_table = "tbl_destaque_credito"
        ordering = ['criado_em']

    def __str__(self):
        return f'{self.fk_agencia} - {self.fk_plano_destaque}'
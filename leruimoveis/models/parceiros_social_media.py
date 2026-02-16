from django.db import models
from leruimoveis.models.parceiros import Parceiro

class ParceirosSocialMedia(models.Model):
    parceiros_social_media_id = models.AutoField(primary_key=True)
    fk_parceiro = models.ForeignKey(Parceiro, on_delete=models.CASCADE)
    social_media = models.CharField(max_length=50)
    social_media_icon = models.TextField(default='icons')
    social_media_link = models.URLField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = "tbl_parceiros_social_media"
    
    def __str__(self):
        return f"{self.id}"

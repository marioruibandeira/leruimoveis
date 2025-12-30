# anuncios/forms.py
from django import forms
from leruimoveis.models import Listagem  
class AnuncioForm(forms.ModelForm):  
    class Meta:
        model = Listagem  
        fields = ['titulo', 'fotos', 'preco', 'endereco', 'descricao', 'pais', 'cidade', 'designacao']  # Use nomes reais
        widgets = {
            'pais': forms.RadioSelect,
            'endereco': forms.Textarea(attrs={'rows': 3}),
            'descricao': forms.Textarea(attrs={'rows': 8}),
        }
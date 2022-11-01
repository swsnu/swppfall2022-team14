from django.db import models
from django.core.validators import RegexValidator

from cocktail.models import Cocktail
from ingredient.models import Ingredient


class IngredientPrepare(models.Model):
    cocktail = models.ForeignKey(
        Cocktail, on_delete=models.CASCADE, related_name='ingredients', null=True)
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.PROTECT, related_name='ingredients', null=False)  # 재료가 Null이 될 수 없다.

    # amount : `${숫자} {단위}`, ex) 1 oz, 60 ml, 1 개, 1 꼬집
    # 추후 도수 계산 시 oz, ml등의 단위에 대해서는 정량적 계산, 그 외의 경우에는 부피가 없음 가정
    AMOUNT_REGEX = RegexValidator(r'(\d*\.?\d+)\s[a-z|A-Z|ㄱ-ㅎ|가-힣]+')
    amount = models.CharField(
        max_length=50, null=False, validators=[AMOUNT_REGEX])

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Ingredient } from "@lib/data/ingredients"

type ProductIngredientsProps = {
  ingredients: Ingredient[]
}

export default function ProductIngredients({
  ingredients,
}: ProductIngredientsProps) {
  if (ingredients.length === 0) return null

  return (
    <div className="w-full py-8 border-t border-brand-border">
      <h3 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium mb-5">
        Składniki z naszego leksykonu
      </h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <LocalizedClientLink
            key={ingredient.id}
            href={`/leksykon/${ingredient.handle}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-brand-border text-sm text-brand-text-muted hover:border-brand-accent/40 hover:text-brand-accent transition-colors duration-200"
          >
            <span>{ingredient.name}</span>
            {ingredient.name_latin && (
              <span className="text-brand-text-muted/50 text-xs italic hidden small:inline">
                {ingredient.name_latin}
              </span>
            )}
          </LocalizedClientLink>
        ))}
      </div>
      <LocalizedClientLink
        href="/leksykon"
        className="inline-block mt-4 text-brand-text-muted/60 text-xs hover:text-brand-accent transition-colors"
      >
        Zobacz cały leksykon składników →
      </LocalizedClientLink>
    </div>
  )
}

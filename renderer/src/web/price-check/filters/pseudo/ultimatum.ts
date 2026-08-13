import { stat } from '@/assets/data'
import { ItemCategory } from '@/parser'
import { ModifierType } from '@/parser/modifiers'
import type { FiltersCreationContext } from '../create-stat-filters'
import { findAndResolveByRef, statToNotFilter } from './utils'
import { FilterTag } from '../interfaces'

// The reward tier is not written on the item, these modifiers of the
// encounter are what gives it away, so they are the only ones worth
// filtering by default.
const TIER_STATS = [
  stat('#% more Monster Life'),
  stat('#% increased Monster Damage')
]

export function applyUltimatumRules (ctx: FiltersCreationContext) {
  const tierStats = ctx.filters.filter(filter => TIER_STATS.includes(filter.statRef))

  for (const filter of tierStats) {
    filter.tag = FilterTag.Property
    filter.disabled = false
  }

  if (!tierStats.length) {
    // the lowest tier has no modifiers of the encounter at all
    ctx.filters.push(...TIER_STATS.map(ref => statToNotFilter({
      stat: findAndResolveByRef(ref, ModifierType.Explicit, ItemCategory.Ultimatum),
      type: ModifierType.Explicit,
      disabled: false
    })))
  }
}

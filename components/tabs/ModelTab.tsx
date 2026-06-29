function ModelTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Matematiksel Model</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Projede bitki su ihtiyacı; ET₀, ETc, TAW, RAW ve etkili yağış hesaplamaları ile belirlenir.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">ET₀ Hesaplama</h3>
        <pre className="rounded-2xl bg-slate-100 p-4 text-sm overflow-x-auto">
ET₀ = (0.408 ⋅ Δ ⋅ (Rₙ - G) + γ ⋅ (900 / (T + 273)) ⋅ u₂ ⋅ (eₛ - eₐ)) / (Δ + γ ⋅ (1 + 0.34 ⋅ u₂))
        </pre>
        <p className="text-sm text-muted-foreground mt-3">
          T: günlük ortalama sıcaklık, u₂: 2 m rüzgar hızı, Rₙ: net radyasyon, G: toprak ısı akısı, eₛ - eₐ: buhar basınç farkıdır.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">ETc Hesaplama</h3>
        <p className="text-sm text-muted-foreground">
          ETc = Kc ⋅ ET₀
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Kc değeri bitkinin büyüme evresine göre seçilir. Kullanılan değerler proje veri tabanından alınır.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Toprak Su Dengesi</h3>
        <p className="text-sm text-muted-foreground mt-2">
TAW = 1000 ⋅ (FC - WP) ⋅ Zr
        </p>
        <p className="text-sm text-muted-foreground mt-2">
RAW = p ⋅ TAW
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Günlük drenaj hesabı:
        </p>
        <pre className="rounded-2xl bg-slate-100 p-4 text-sm overflow-x-auto">
Dᵣₙₑₓₜ = max(0, min(TAW, Dᵣₚᵣₑᵥ + ETc - Pe - Sulama))
        </pre>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Etkili Yağış</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Pe, yağışın bitki tarafından kullanılabilir kısmıdır.
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li>Yağış ≤ 5 mm ise Pe = 0.9 ⋅ P</li>
          <li>5 &lt; Yağış ≤ 20 mm ise Pe = 0.75 ⋅ P</li>
          <li>Yağış &gt; 20 mm ise Pe = 0.6 ⋅ P</li>
        </ul>
      </section>
    </div>
  )
}

export default ModelTab
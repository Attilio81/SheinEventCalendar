# Fix Techno Events Database - Rimuovere Dati Vecchi/Fake

Se vedi ancora evento come "Audiodrome Sessions - Charlotte de Witte" con la label "MOCK", segui questi passi per pulire il database e ricaricare SOLO i 21 festival reali confermati.

## Passaggi:

### 1️⃣ CLEANUP - Rimuovere Dati Vecchi
Vai a **Supabase SQL Editor** e esegui:

```sql
-- Delete all old/mock events
DELETE FROM public_techno_events
WHERE title LIKE '%Charlotte%'
   OR title LIKE '%Audiodrome Sessions%'
   OR source IS NULL
   OR source_url IS NULL;

-- Verify
SELECT COUNT(*) as remaining_events FROM public_techno_events;
```

**Output atteso:** `remaining_events: 0` (o comunque meno di 21)

---

### 2️⃣ POPULATE - Caricare i 21 Festival Reali
Dopo il cleanup, esegui il file `supabase-techno-events-populate.sql`:

Copia-incolla il contenuto di `supabase-techno-events-populate.sql` nello SQL Editor e clicca **Run**.

**Output atteso:**
```
total_events: 21
unique_cities: 8
unique_countries: 6
```

---

### 3️⃣ VERIFY - Verificare nel Browser
1. Ricarica l'app (F5)
2. Vai a **🎵 Techno Events**
3. Clicca il filtro **"All"** per vedere tutti gli eventi
4. Dovrebbe mostrare **21 festival reali** senza la label MOCK

---

## Eventi da Pulire

Questi sono gli eventi FAKE che devono essere rimossi:
- ❌ "Audiodrome Sessions - Charlotte de Witte" (7 Nov 2025)
- ❌ Qualsiasi evento con label "MOCK"

---

## Eventi che Rimangono (21 REALI)

✅ AWAKENINGS FESTIVAL 2026 (Jun 27-28)
✅ TIME WARP 2025 (Nov 7-8)
✅ KAPPA FUTURFESTIVAL 2026 (Jul 3-5, Turin)
✅ Q35 WAREHOUSE events (Sep-Oct 2025)
✅ AUDIODROME presents ENRICO SANGIULIANO (Oct 17, 2025)
✅ E altri 16 festival europei confermati...

---

## Alternativa: Pulire TUTTO e Ricominciare

Se vuoi cancellare TUTTO e ricominciare da zero:

```sql
-- WARNING: This deletes ALL events!
DELETE FROM public_techno_events;

-- Verify
SELECT COUNT(*) as total_events FROM public_techno_events;
```

**Output atteso:** `total_events: 0`

Poi esegui `supabase-techno-events-populate.sql` per ricaricare i 21 reali.

---

## Domande?

Se il problema persiste:

1. Verifica che Supabase sia sincronizzato: Vai a Supabase → Table Editor → public_techno_events
2. Cerca manualmente "Charlotte de Witte" e cancella quella riga
3. Ricarica l'app (F5)

Se vedi ancora "MOCK" nella lista, significa che l'app sta leggendo da una cache. Prova:
- Hard refresh: **Ctrl+Shift+R** (Chrome) oppure **Cmd+Shift+R** (Mac)
- Pulisci browser cache: DevTools → Application → Clear Storage

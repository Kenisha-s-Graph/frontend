<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Query Editor</h3>
      </template>

      <UTextarea
        v-model="query"
        placeholder="MATCH (q:Person) RETURN q AS Person LIMIT 2"
        :rows="3"
        autoresize
        class="font-mono w-full"
      />

      <template #footer>
        <div class="flex justify-between items-center">
          <UButton
            @click="runQuery"
            :loading="loading"
            icon="i-heroicons-play"
            size="lg"
          >
            Run Query
          </UButton>
          <UButton
            @click="clearResults"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
          >
            Clear
          </UButton>
        </div>
      </template>
    </UCard>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <UCard v-if="results">
        <template #header>
            <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Results</h3>
            <UBadge color="primary" variant="subtle">
                {{ resultCount }} {{ resultCount === 1 ? 'row' : 'rows' }}
            </UBadge>
            </div>
        </template>

        <div v-if="parsedResults.length" class="overflow-x-auto">
            <table class="min-w-full text-sm">
                <thead>
                <tr>
                    <th
                    v-for="col in columns"
                    :key="col"
                    class="px-3 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800"
                    >
                    {{ col }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, idx) in parsedResults" :key="idx">
                    <td
                    v-for="col in columns"
                    :key="col"
                    class="px-3 py-2 border-t border-gray-200 dark:border-gray-700"
                    >
                    <span v-if="isNeo4jObject(row[col], col)">
                        <span class="font-mono text-primary">(:{{ col }}</span>
                        <span class="font-mono"> {{ formatNeo4jProps(row[col]) }})</span>
                    </span>
                    <span v-else>
                        {{ formatCell(row[col]) }}
                    </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <pre class="overflow-x-auto text-sm bg-elevated rounded-lg p-4">{{ results }}</pre>
        </div>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Query Examples</h3>
      </template>

      <div class="space-y-2">
        <UButton
          v-for="(example, idx) in examples"
          :key="idx"
          @click="query = example.query"
          color="neutral"
          variant="soft"
          block
          class="justify-start font-mono text-xs"
        >
          {{ example.label }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCypherQuery } from "~/data/cypher-query";

const query = ref("MATCH (q:Person) RETURN q AS Person LIMIT 2");
const results = ref("");
const error = ref("");
const loading = ref(false);

const { fetchCypherQuery } = useCypherQuery();

const examples = [
  {
    label: "Get 2 persons",
    query: "MATCH (q:Person) RETURN q AS Person LIMIT 2"
  },
  {
    label: "Get person names",
    query: "MATCH (q:Person) RETURN q.full_name AS name LIMIT 5"
  },
  {
    label: "Count all persons",
    query: "MATCH (q:Person) RETURN count(q) AS total"
  }
];

const parsedResults = computed(() => {
  try {
    const arr = JSON.parse(results.value);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
});

const columns = computed(() => {
  if (!parsedResults.value.length) return [];
  // Ambil semua key unik dari seluruh baris
  const keys = new Set<string>();
  parsedResults.value.forEach(row => {
    Object.keys(row).forEach(k => keys.add(k));
  });
  return Array.from(keys);
});

function formatCell(val: any) {
  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
  return val;
}

function isNeo4jObject(val: any, col: string) {
  return val && typeof val === 'object' && !Array.isArray(val) && /^[A-Z]/.test(col);
}

function formatNeo4jProps(obj: Record<string, any>) {
  if (!obj || typeof obj !== 'object') return '';
  const props = Object.entries(obj)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  return `{${props}}`;
}

const resultCount = computed(() => {
  if (!results.value) return 0;
  try {
    return JSON.parse(results.value).length || 0;
  } catch {
    return 0;
  }
});

const runQuery = async () => {
  loading.value = true;
  error.value = "";
  results.value = "";
  try {
    const res = await fetchCypherQuery({ query: query.value });
    results.value = JSON.stringify(res.results, null, 2);
  } catch (e: any) {
    error.value = e.detail || e.message || "Failed to execute query";
  } finally {
    loading.value = false;
  }
};

const clearResults = () => {
  results.value = "";
  error.value = "";
};
</script>
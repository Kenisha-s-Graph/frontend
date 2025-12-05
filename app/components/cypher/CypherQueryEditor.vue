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

    <UCard v-if="responseData">
        <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Results</h3>
              <div class="flex items-center gap-3">
                <UBadge color="primary" variant="subtle">
                    {{ resultCount }} {{ resultCount === 1 ? 'row' : 'rows' }}
                </UBadge>
                <div class="flex gap-1">
                  <UButton
                    @click="viewMode = 'graph'"
                    :color="viewMode === 'graph' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'graph' ? 'solid' : 'ghost'"
                    size="sm"
                  >
                    Graph
                  </UButton>
                  <UButton
                    @click="viewMode = 'table'"
                    :color="viewMode === 'table' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'table' ? 'solid' : 'ghost'"
                    size="sm"
                  >
                    Table
                  </UButton>
                  <UButton
                    @click="viewMode = 'raw'"
                    :color="viewMode === 'raw' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'raw' ? 'solid' : 'ghost'"
                    size="sm"
                  >
                    RAW
                  </UButton>
                </div>
              </div>
            </div>
        </template>

        <div v-if="viewMode === 'graph'">
          <GraphVisualization :data="graphData" :stats="responseData?.graph?.stats" />
        </div>

        <div v-else-if="viewMode === 'table'">
          <div v-if="tableData.length" class="overflow-x-auto">
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
                  <tr v-for="(row, idx) in tableData" :key="idx">
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
              <pre class="overflow-x-auto text-sm bg-elevated rounded-lg p-4">No table data available</pre>
          </div>
        </div>

        <div v-else-if="viewMode === 'raw'">
          <pre class="overflow-x-auto text-sm bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-[600px]">{{ rawText }}</pre>
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
import type { ViewMode, CypherQueryResponse } from "~/types/cypher";
import GraphVisualization from "./GraphVisualization.vue";

const query = ref("MATCH (q:Person) RETURN q AS Person LIMIT 2");
const responseData = ref<CypherQueryResponse | null>(null);
const error = ref("");
const loading = ref(false);
const viewMode = ref<ViewMode>("table");

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

// Transform graph data for GraphVisualization component
const graphData = computed(() => {
  if (!responseData.value?.graph) return [];
  
  const { nodes, relationships } = responseData.value.graph;
  const result: any[] = [];
  
  // Add nodes to result
  nodes.forEach(node => {
    result.push({
      [node.labels[0] || 'Node']: {
        id: node.id,
        labels: node.labels,
        ...node.properties
      }
    });
  });
  
  // Add relationships to result with start/end for compatibility
  relationships.forEach(rel => {
    result.push({
      [rel.type]: {
        id: rel.id,
        type: rel.type,
        start: rel.startNode,
        end: rel.endNode,
        ...rel.properties
      }
    });
  });
  
  return result;
});

// Table data from new API format
const tableData = computed(() => {
  return responseData.value?.table || [];
});

// Raw text data from new API format
const rawText = computed(() => {
  if (!responseData.value?.text) return "";
  
  // Format text array as readable output
  return responseData.value.text.map(row => {
    return Object.entries(row)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }).join('\n\n');
});

// Columns for table view
const columns = computed(() => {
  if (!tableData.value.length) return [];
  const keys = new Set<string>();
  tableData.value.forEach(row => {
    Object.keys(row).forEach(k => keys.add(k));
  });
  return Array.from(keys);
});

// Result count from summary
const resultCount = computed(() => {
  return responseData.value?.summary?.recordCount || 0;
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

const runQuery = async () => {
  loading.value = true;
  error.value = "";
  responseData.value = null;
  try {
    const res = await fetchCypherQuery({ query: query.value });
    responseData.value = res as CypherQueryResponse;
  } catch (e: any) {
    error.value = e.detail || e.message || "Failed to execute query";
  } finally {
    loading.value = false;
  }
};

const clearResults = () => {
  responseData.value = null;
  error.value = "";
};
</script>
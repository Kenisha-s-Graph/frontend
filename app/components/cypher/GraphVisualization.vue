<template>
  <div class="flex gap-4">
    <!-- Main Graph Area -->
    <div class="flex-1">
      <div ref="graphContainer" class="w-full h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"></div>
    </div>

    <!-- Side Panel -->
    <div v-if="selectedNode || selectedEdge || showOverview || showStylePanel" class="w-80 space-y-4">
      <!-- Results Overview Panel -->
      <UCard v-if="showOverview && !selectedNode && !selectedEdge">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Results overview</h3>
            <UButton
              @click="showOverview = false"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="xs"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Nodes ({{ nodeCount }})</span>
              <UButton
                icon="i-heroicons-arrows-up-down"
                color="neutral"
                variant="ghost"
                size="xs"
              />
            </div>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(count, type) in nodeTypeStats"
                :key="type"
                color="primary"
                variant="soft"
              >
                {{ type }} ({{ count }})
              </UBadge>
            </div>
          </div>

          <div v-if="edgeCount > 0">
            <div class="text-sm font-medium mb-2">
              Relationships ({{ edgeCount }})
            </div>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(count, type) in edgeTypeStats"
                :key="type"
                color="neutral"
                variant="soft"
              >
                {{ type }} ({{ count }})
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Node Details Panel -->
      <UCard v-if="selectedNode">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Node details</h3>
            <UButton
              @click="clearSelection"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="xs"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UBadge v-if="selectedNode.group" color="primary" variant="soft" size="lg">
            {{ selectedNode.group }}
          </UBadge>

          <div class="space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="[key, value] in Object.entries(selectedNode)"
              :key="key"
            >
              <template v-if="!['group', 'title', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'label', 'color', 'font', 'shape', 'size', 'borderWidth', 'borderWidthSelected', '_labels', 'embedding', 'embedding_updated', 'searchable_text'].includes(key)">
                <div class="flex items-start justify-between gap-2 py-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {{ key === 'id' ? '&lt;id&gt;' : key }}
                    </div>
                    <div class="text-sm text-gray-900 dark:text-gray-100 break-all">
                      <template v-if="key === 'image_url'">
                        <a :href="value" target="_blank" class="text-primary hover:underline text-xs break-all">{{ value }}</a>
                      </template>
                      <template v-else-if="typeof value === 'string' && value.startsWith('[') && value.includes(',')">
                        <pre class="whitespace-pre-wrap font-mono text-xs">{{ value }}</pre>
                      </template>
                    
                      <template v-else>
                        {{ formatValue(value) }}
                      </template>
                    </div>
                  </div>
                  <UButton
                    @click="copyToClipboard(formatValue(value))"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-clipboard-document"
                    size="xs"
                    class="flex-shrink-0"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Relationship Details Panel -->
      <UCard v-if="selectedEdge">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Relationship details</h3>
            <UButton
              @click="clearSelection"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="xs"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UBadge v-if="selectedEdge.label" color="neutral" variant="soft" size="lg">
            {{ selectedEdge.label }}
          </UBadge>

          <div class="space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="[key, value] in Object.entries(selectedEdge)"
              :key="key"
            
            >
              <template v-if="!['arrows', 'title', 'color', 'font', 'smooth', 'width', '_type', 'label', 'from', 'to', 'start', 'end', 'type'].includes(key) && !key && !value">
                <div class="flex items-start justify-between gap-2 py-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {{ key === '_relId' || key === 'id' ? '&lt;id&gt;' : key }}
                    </div>
                    <div class="text-sm text-gray-900 dark:text-gray-100 break-all">
                      <template v-if="typeof value === 'object' && value !== null">
                        <pre class="whitespace-pre-wrap font-mono text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded">{{ JSON.stringify(value, null, 2) }}</pre>
                      </template>
                      <template v-else>
                        {{ formatValue(value) }}
                      </template>
                    </div>
                  </div>
                  <UButton
                    @click="copyToClipboard(formatValue(value))"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-clipboard-document"
                    size="xs"
                    class="flex-shrink-0"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Stats } from '~/types/cypher';

interface Props {
  data: any[];
  stats?: Stats;
}

const props = defineProps<Props>();

const graphContainer = ref<HTMLElement | null>(null);
let network: Network | null = null;
let nodesDataSet: DataSet<any> | null = null;
let edgesDataSet: DataSet<any> | null = null;

const selectedNode = ref<any>(null);
const selectedEdge = ref<any>(null);
const showOverview = ref(true);
const showStylePanel = ref(true);

// Computed properties from stats
const nodeCount = computed(() => props.stats?.nodeCount || 0);
const edgeCount = computed(() => props.stats?.relationshipCount || 0);
const nodeTypeStats = computed(() => props.stats?.nodeLabels || {});
const edgeTypeStats = computed(() => props.stats?.relationshipTypes || {});

// Customize style state
const selectedColor = ref('#97C2FC');
const selectedSize = ref(20);
const selectedCaptions = ref<string[]>(['id', 'label']);
const availableColors = [
  '#FFD700', '#DA70D6', '#FF6347', '#48D1CC', '#FF6B6B',
  '#C0C0C0', '#90EE90', '#FFB6C1', '#4169E1', '#FFD700',
  '#FF69B4', '#708090', '#A9A9A9', '#9370DB', '#20B2AA'
];
const availableSizes = [12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
const availableFields = ref<string[]>([]);

const extractGraphData = (data: any[]) => {
  const nodes = new Map();
  const edges: any[] = [];
  let edgeId = 0;
  const fields = new Set<string>();

  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]: [string, any]) => {
      // Deteksi node (object dengan properties dan bukan relationship)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Check if it's a node (has properties but no start/end)
        if (!value.start && !value.end && !value.type) {
          const nodeId = value.id || value.uri || `${key}_${JSON.stringify(value)}`;
          
          if (!nodes.has(nodeId)) {
            // Get label from various possible fields
            let label = value.full_name || value.name || value.label || value.title || key;
            
            // Get node type/label
            let group = 'default';
            if (value.labels && Array.isArray(value.labels)) {
              group = value.labels[0];
            } else if (/^[A-Z]/.test(key)) {
              group = key;
            }

            // Collect all fields for caption options
            Object.keys(value).forEach(k => {
              if (!['id', 'uri', 'labels'].includes(k)) {
                fields.add(k);
              }
            });

            nodes.set(nodeId, {
              id: nodeId,
              label: label,
              title: formatNodeTitle(value),
              group: group,
              ...value
            });
          }
        }
        // Deteksi relationship (has start, end, type)
        else if (value.start && value.end && value.type) {
          edges.push({
            id: edgeId++,
            from: value.start,
            to: value.end,
            label: value.type,
            arrows: 'to',
            title: value.type,
            ...value
          });
        }
      }
    });
  });

  availableFields.value = ['id', '<id>', '<type>', ...Array.from(fields)];
  return {
    nodes: Array.from(nodes.values()),
    edges: edges
  };
};

const formatNodeTitle = (node: any) => {
  const excludeFields = ['id', 'uri', 'labels', '_labels', 'embedding', 'embedding_updated', 'searchable_text'];
  const props = Object.entries(node)
    .filter(([key]) => !excludeFields.includes(key))
    .slice(0, 10) // Limit to first 10 properties for tooltip
    .map(([key, value]) => {
      let displayValue = value;
      if (typeof value === 'string' && value.length > 50) {
        displayValue = value.substring(0, 47) + '...';
      }
      return `<b>${key}:</b> ${displayValue}`;
    })
    .join('<br/>');
  return props || 'Node';
};

const formatValue = (value: any) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const clearSelection = () => {
  selectedNode.value = null;
  selectedEdge.value = null;
  if (network) {
    network.unselectAll();
  }
};

const toggleCaption = (field: string) => {
  const index = selectedCaptions.value.indexOf(field);
  if (index > -1) {
    selectedCaptions.value.splice(index, 1);
  } else {
    selectedCaptions.value.push(field);
  }
};

const renderGraph = () => {
  if (!graphContainer.value || !props.data || props.data.length === 0) {
    return;
  }

  const { nodes, edges } = extractGraphData(props.data);

  nodesDataSet = new DataSet(nodes);
  edgesDataSet = new DataSet(edges);
  console.log("NODES DATASET", nodesDataSet);
  console.log("EDGES DATASET", edgesDataSet);

  const options = {
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        size: 14,
        color: '#333333',
        face: 'arial'
      },
      borderWidth: 2,
      borderWidthSelected: 3,
      color: {
        border: '#2B7CE9',
        background: '#97C2FC',
        highlight: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        }
      }
    },
    edges: {
      width: 2,
      color: {
        color: '#848484',
        highlight: '#2B7CE9'
      },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5
        }
      },
      font: {
        size: 12,
        align: 'middle'
      },
      smooth: {
        enabled: true,
        type: 'continuous',
        roundness: 0.5
      }
    },
    groups: {
      Person: {
        color: { background: '#B8B894', border: '#999966' }
      },
      City: {
        color: { background: '#5FCFC0', border: '#3DA89A' }
      },
      Movie: {
        color: { background: '#99FF99', border: '#55FF55' }
      },
      Organization: {
        color: { background: '#9999FF', border: '#5555FF' }
      },
      Location: {
        color: { background: '#FFFF99', border: '#FFFF55' }
      },
      default: {
        color: { background: '#97C2FC', border: '#2B7CE9' }
      }
    },
    physics: {
      stabilization: {
        iterations: 200
      },
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 150,
        springConstant: 0.04
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      zoomView: true,
      dragView: true
    }
  };

  if (network) {
    network.destroy();
  }

  network = new Network(
    graphContainer.value,
    { nodes: nodesDataSet, edges: edgesDataSet },
    options
  );

  // Add event listeners
  network.on('selectNode', (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      selectedNode.value = nodesDataSet?.get(nodeId);
      selectedEdge.value = null;
      showOverview.value = false;
      showStylePanel.value = false;
    }
  });

  network.on('selectEdge', (params) => {
    if (params.edges.length > 0) {
      const edgeId = params.edges[0];
      selectedEdge.value = edgesDataSet?.get(edgeId);
      selectedNode.value = null;
      showOverview.value = false;
      showStylePanel.value = false;
    }
  });

  network.on('deselectNode', () => {
    if (!selectedEdge.value) {
      selectedNode.value = null;
      showOverview.value = true;
      showStylePanel.value = true;
    }
  });

  network.on('deselectEdge', () => {
    if (!selectedNode.value) {
      selectedEdge.value = null;
      showOverview.value = true;
      showStylePanel.value = true;
    }
  });
};

watch(() => props.data, () => {
  renderGraph();
}, { deep: true });

onMounted(() => {
  renderGraph();
});

onBeforeUnmount(() => {
  if (network) {
    network.destroy();
    network = null;
  }
});
</script>

<style scoped>
/* Vis.js styling overrides if needed */
</style>

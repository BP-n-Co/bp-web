<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  interface Props {
    commits?: Array<{ lines_added: number, lines_deleted: number, created_date: string }>;
  }

  let { commits = [] }: Props = $props();
  
  let chartContainer = $state<HTMLCanvasElement | undefined>(undefined);
  let chart: Chart | null = null;
  
  function createChart() {
    if (!chartContainer) return;
    
    // Prepare data
    const dates = commits.map(commit => new Date(commit.created_date).toLocaleDateString());
    const linesAdded = commits.map(commit => commit.lines_added);
    const linesDeleted = commits.map(commit => -commit.lines_deleted); // Negative values for deleted lines
    
    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    // Create new chart
    chart = new Chart(chartContainer, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Lines Added',
            data: linesAdded,
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            categoryPercentage: 0.8,
            barPercentage: 1.0,
            order: 2,
          },
          {
            label: 'Lines Deleted',
            data: linesDeleted,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            categoryPercentage: 0.8,
            barPercentage: 1.0,
            order: 1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            stacked: true
          },
          y: {
            title: {
              display: true,
              text: 'Lines Changed'
            },
            beginAtZero: true,
            grace: '10%', // Add some padding for better visibility
            stacked: false
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                const datasetLabel = context.dataset.label || '';
                let value = context.parsed.y;
                
                // Show absolute value for deleted lines in tooltip
                if (datasetLabel === 'Lines Deleted') {
                  value = Math.abs(value);
                  return `${datasetLabel}: ${value}`;
                }
                
                return `${datasetLabel}: ${value}`;
              }
            }
          }
        }
      }
    });
  }
  
  $effect(() => {
    if (commits && chartContainer) {
      createChart();
    }
  });
  
  onMount(() => {
    if (commits.length > 0 && chartContainer) {
      createChart();
    }
  });
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="chart-container" style="height: 400px; width: 100%;">
  {#if commits.length === 0}
    <div class="flex items-center justify-center h-full bg-gray-50 rounded border">
      <p class="text-gray-500">No commit data available</p>
    </div>
  {:else}
    <canvas bind:this={chartContainer}></canvas>
  {/if}
</div> 
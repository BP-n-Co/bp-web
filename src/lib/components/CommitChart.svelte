<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let commits: Array<{ lines_added: number, lines_deleted: number, created_date: string }> = [];
  
  let chartContainer: HTMLCanvasElement;
  let chart: Chart | null = null;
  
  function createChart() {
    if (!chartContainer) return;
    
    // Prepare data
    const dates = commits.map(commit => new Date(commit.created_date).toLocaleDateString());
    const linesAdded = commits.map(commit => commit.lines_added);
    const linesDeleted = commits.map(commit => commit.lines_deleted);
    
    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    // Create new chart
    chart = new Chart(chartContainer, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Lines Added',
            data: linesAdded,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            yAxisID: 'y-axis-1',
            tension: 0.1,
          },
          {
            label: 'Lines Deleted',
            data: linesDeleted,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y-axis-2',
            tension: 0.1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          'y-axis-1': {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Lines Added'
            },
            grid: {
              drawOnChartArea: false
            }
          },
          'y-axis-2': {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Lines Deleted'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
  
  $: if (commits && chartContainer) {
    createChart();
  }
  
  onMount(() => {
    if (commits.length > 0) {
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
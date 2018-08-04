function buildMetadata(sample) {
  var MetaData = `/metadata/${sample}`;
d3.json(MetaData).then(function(response) {

  var panelData = d3.select("#sample-metadata");
  panelData.html("");

  Object.entries(response).forEach(([key, value]) => {
    panelData.append("div").text(`${key}: ${value}`);
  });
})}

function buildCharts(sample) {
  var SampleData = `/samples/${sample}`;

  d3.json(SampleData).then(function(response) {
    var otu_ids = response.otu_ids.slice(0,10);
    var otu_labels = response.otu_labels.slice(0,10);
    var sample_values = response.sample_values.slice(0,10);

    var data = [{
      labels: otu_ids,
      values: sample_values,
      hovertext: otu_labels,
      type: "pie"
    }];

    var layout = {
      height:600,
      width: 600
    };

    Plotly.newPlot("pie", data,layout);
    
    var bubble_otu_ids = response.otu_ids;
    var bubble_otu_labels = response.otu_labels;
    var bubble_sample_values = response.sample_values;

    var trace1 = {
      x: bubble_otu_ids,
      y: bubble_sample_values,
      text: bubble_otu_labels,
      mode:'markers',
      marker: {
        color:bubble_otu_ids,
        colorscale: 'Rainbow',
        size: bubble_sample_values
      }

    };

    var data = [trace1];

    var layout = {
      height:600,
      width: 1200
    };

    Plotly.newPlot("bubble", data, layout);
});   

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

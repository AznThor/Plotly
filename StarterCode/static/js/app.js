//apps
// Use the D3 library to read in samples.json
d3.json("data/samples.json").then((DataImport) => {
	
    console.log(DataImport);
	var data = DataImport;
	// Drop Downmenus test subject
	var names = data.names;
	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})
	
	function INIT() {
		// Test Subject ID
		defaultDataset = data.samples.filter(sample => sample.id === "940")[0];
		console.log(defaultDataset);
		// look at the sample values
		allSampleValuesDefault = defaultDataset.sample_values;
		allOtuIdsDefault = defaultDataset.otu_ids;
		allOtuLabelsDefault = defaultDataset.otu_labels;
		// Top 10 OTUS
		sampleValuesDefault = allSampleValuesDefault.slice(0, 10).reverse();
		otuIdsDefault = allOtuIdsDefault.slice(0, 10).reverse();
		otuLabelsDefault = allOtuLabelsDefault.slice(0, 10).reverse();
		console.log(sampleValuesDefault);
		console.log(otuIdsDefault);
		console.log(otuLabelsDefault);
        // Bar chart
		var trace1 = {
			x: sampleValuesDefault,
			y: otuIdsDefault.map(outId => `OTU ${outId}`),
			text: otuLabelsDefault,
			type: "bar",
			orientation: "h"
		};
		var barData = [trace1];
		var barlayout = {
			autosize: false,
			width: 550,
			height: 650
		}
		Plotly.newPlot("bar", barData, barlayout);
		// Bubble chart
		var trace2 = {
			x: allOtuIdsDefault,
			y: allSampleValuesDefault,
			text: allOtuLabelsDefault,
			mode: 'markers',
			marker: {
				color: allOtuIdsDefault,
				size: allSampleValuesDefault
			}
		};
		var bubbleData = [trace2];
		var bubbleLayout = {
			xaxis: { title: "OTU ID"},
			showlegend: false,
		};
		Plotly.newPlot('bubble', bubbleData, bubbleLayout);
		// Demographic Info
		demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);
		Object.entries(demoDefault).forEach(
			([key, value]) => d3.select("#sample-metadata")
													.append("p").text(`${key.toUpperCase()}: ${value}`));
	}
	INIT();
	// Update barchart when change happens
	d3.selectAll("#selDataset").on("change", updatePlot);
	// HORIZONTAL Drop down bar chart.
	function updatePlot() {
		// Use D3 to select the dropdown menu
        var inputElement = d3.select("#selDataset");
        var inputValue = inputElement.property("value");
        console.log(inputValue);
		// Filter for input IDS
        dataset = data.samples.filter(sample => sample.id === inputValue)[0];
        console.log(dataset);
		// Checkout the sample values 
        allSampleValues = dataset.sample_values;
        allOtuIds = dataset.otu_ids;
        allOtuLabels = dataset.otu_labels;
		// Top 10 OTUS set up 
		top10Values = allSampleValues.slice(0, 10).reverse();
		top10Ids = allOtuIds.slice(0, 10).reverse();
		top10Labels = allOtuLabels.slice(0, 10).reverse();

        //CHARTS
		// Bar Chart
		Plotly.restyle("bar", "x", [top10Values]);
		Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle("bar", "text", [top10Labels]);
		// Bubble Chart
		Plotly.restyle('bubble', "x", [allOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allOtuLabels]);
		Plotly.restyle('bubble', "marker.color", [allOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);
		// Demographic Info finalized. 
		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];
		d3.select("#sample-metadata").html("");
		Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
	}
});

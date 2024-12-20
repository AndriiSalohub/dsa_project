import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon, Save, Book } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const App = () => {
  const defaultExamples = {
    "Simple Ascending": [1, 2, 3, 4, 5],
    "Mixed Sequence": [5, 2, 8, 6, 3, 6, 9, 7],
    "Complex Pattern": [10, 22, 9, 33, 21, 50, 41, 60, 80],
    "Repeated Numbers": [3, 3, 3, 4, 4, 5, 5, 6],
  };

  const [sequence, setSequence] = useState([5, 2, 8, 6, 3, 6, 9, 7]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [lisResult, setLisResult] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [examples, setExamples] = useState(defaultExamples);
  const [newExampleName, setNewExampleName] = useState("");
  const [isAddingExample, setIsAddingExample] = useState(false);

  const findLIS = (arr) => {
    const n = arr.length;
    const d = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);
    const algorithmSteps = [];

    algorithmSteps.push({
      step: 0,
      description: "Initial sequence",
      currentArray: [...arr],
      lengths: [...d],
      prevPointers: [...prev],
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i] && d[j] + 1 > d[i]) {
          d[i] = d[j] + 1;
          prev[i] = j;

          algorithmSteps.push({
            step: algorithmSteps.length,
            description: `Comparing elements at positions ${j} and ${i}: ${arr[j]} < ${arr[i]}`,
            currentArray: [...arr],
            lengths: [...d],
            prevPointers: [...prev],
            currentI: i,
            currentJ: j,
          });
        }
      }
    }

    let pos = d.indexOf(Math.max(...d));
    const answer = [];

    while (pos !== -1) {
      answer.unshift(arr[pos]);
      pos = prev[pos];
    }

    algorithmSteps.push({
      step: algorithmSteps.length,
      description: "Final Longest Increasing Subsequence",
      currentArray: [...arr],
      lisResult: [...answer],
    });

    return { steps: algorithmSteps, lis: answer };
  };

  useEffect(() => {
    const { steps: algorithmSteps, lis } = findLIS(sequence);
    setSteps(algorithmSteps);
    setLisResult(lis);
    setCurrentStep(0);
  }, [sequence]);

  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const addNumber = () => {
    if (newNumber.trim() !== "") {
      const num = parseInt(newNumber);
      if (!isNaN(num)) {
        setSequence([...sequence, num]);
        setNewNumber("");
      }
    }
  };

  const removeNumber = (indexToRemove) => {
    setSequence(sequence.filter((_, index) => index !== indexToRemove));
  };

  const loadExample = (exampleName) => {
    if (examples[exampleName]) {
      setSequence(examples[exampleName]);
      setCurrentStep(0);
    }
  };

  const saveCurrentAsExample = () => {
    if (newExampleName.trim() !== "") {
      setExamples({
        ...examples,
        [newExampleName]: [...sequence],
      });
      setNewExampleName("");
      setIsAddingExample(false);
    }
  };

  const deleteExample = (exampleName) => {
    const newExamples = { ...examples };
    delete newExamples[exampleName];
    setExamples(newExamples);
  };

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    if (!step) return null;

    return (
      <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 shadow-sm">
        <h3 className="text-xl font-medium mb-3 text-neutral-800">
          Step {step.step}: {step.description}
        </h3>

        <div className="mb-4">
          <h4 className="text-md font-medium mb-2 text-neutral-600">
            Current Sequence
          </h4>
          <div className="flex space-x-2">
            {step.currentArray?.map((num, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-sm 
                  ${
                    step.currentI === index
                      ? "bg-neutral-700 text-white"
                      : step.currentJ === index
                        ? "bg-neutral-500 text-white"
                        : "bg-white text-neutral-800 border border-neutral-300"
                  }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {step.lengths && (
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2 text-neutral-600">
              LIS Lengths at Each Position
            </h4>
            <div className="flex space-x-2">
              {step.lengths.map((length, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-sm 
                    ${
                      step.currentI === index
                        ? "bg-neutral-700 text-white"
                        : "bg-white text-neutral-800 border border-neutral-300"
                    }`}
                >
                  {length}
                </div>
              ))}
            </div>
          </div>
        )}

        {step.lisResult && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-neutral-600">
              Current LIS Found
            </h4>
            <div className="flex space-x-2">
              {step.lisResult.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-lg shadow-sm bg-neutral-600 text-white"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExamplesSection = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-lg font-medium text-neutral-700">
          Preset Examples
        </label>
        <Button
          variant="outline"
          onClick={() => setIsAddingExample(!isAddingExample)}
          className="text-neutral-600 hover:bg-neutral-100"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Current
        </Button>
      </div>

      {isAddingExample && (
        <div className="flex space-x-2 mb-3">
          <Input
            value={newExampleName}
            onChange={(e) => setNewExampleName(e.target.value)}
            placeholder="Enter example name"
            className="flex-grow"
          />
          <Button
            onClick={saveCurrentAsExample}
            className="bg-neutral-700 text-white hover:bg-neutral-600"
          >
            Save
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(examples).map(([name, seq]) => (
          <div
            key={name}
            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
          >
            <div className="flex-1">
              <div className="font-medium text-neutral-700 mb-1">{name}</div>
              <div className="text-neutral-500 text-sm">[{seq.join(", ")}]</div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample(name)}
                className="text-neutral-600 hover:bg-neutral-100"
              >
                <Book className="w-4 h-4 mr-2" />
                Load
              </Button>
              {name in defaultExamples ? null : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteExample(name)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Card className="bg-white shadow-lg rounded-xl border border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-medium">
            Longest Increasing Subsequence Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="about">
              <AccordionTrigger className="text-lg font-medium text-neutral-800">
                About the Algorithm
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 space-y-4">
                <p>
                  The Longest Increasing Subsequence (LIS) algorithm finds the
                  longest subsequence of numbers that are in strictly increasing
                  order. A subsequence doesn't need to be contiguous but must
                  maintain the relative ordering of elements.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-800">
                    Algorithm Steps:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>
                      Initialize an array 'd' where d[i] stores the length of
                      the LIS ending at index i
                    </li>
                    <li>
                      For each position i, look at all previous positions j
                    </li>
                    <li>
                      If the element at j is smaller than the element at i, we
                      can potentially extend that subsequence
                    </li>
                    <li>
                      Update d[i] to be the maximum of its current value and
                      d[j] + 1
                    </li>
                    <li>
                      Track the previous indices to reconstruct the sequence
                    </li>
                  </ol>
                </div>
                <p>
                  Time Complexity: O(n²) where n is the length of the sequence
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage">
              <AccordionTrigger className="text-lg font-medium text-neutral-800">
                How to Use This Visualizer
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-800">
                    Interface Controls:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Add numbers using the input field and "Add Number" button
                    </li>
                    <li>
                      Remove numbers by clicking the trash icon next to them
                    </li>
                    <li>
                      Use "Previous Step" and "Next Step" to walk through the
                      algorithm
                    </li>
                    <li>
                      Watch the visualization update as each step processes
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-800">
                    Visual Elements:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Dark gray highlights show the current position being
                      processed
                    </li>
                    <li>
                      Medium gray highlights show the position being compared
                    </li>
                    <li>
                      The "Lengths" array shows the LIS length ending at each
                      position
                    </li>
                    <li>
                      The final result shows the actual longest increasing
                      subsequence found
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {renderExamplesSection()}

          <div className="mb-6">
            <label className="block mb-3 text-lg font-medium text-neutral-700">
              Input Sequence
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Enter a number"
                className="flex-grow border-neutral-300 focus:border-neutral-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addNumber();
                  }
                }}
              />
              <Button
                onClick={addNumber}
                className="bg-neutral-700 text-white hover:bg-neutral-600"
              >
                <PlusIcon className="mr-2 w-4 h-4" /> Add Number
              </Button>
            </div>
          </div>

          <div className="flex justify-between space-x-2 mb-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Previous Step
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="flex-1 bg-neutral-700 text-white hover:bg-neutral-600"
            >
              Next Step
            </Button>
          </div>

          {renderCurrentStep()}

          <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200 shadow-sm">
            <h4 className="text-xl font-medium mb-3 text-neutral-800">
              Final Longest Increasing Subsequence
            </h4>
            <div className="flex space-x-2">
              {lisResult.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-lg shadow-sm bg-neutral-600 text-white"
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="mt-3 text-neutral-600">
              Length: {lisResult.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

"use strict";
/*
Basic Properties
These properties are shared among all luggage types and should be private, protected, and readonly accordingly:

weight (number): The weight of the luggage.
description (string): A description of the luggage.
Priority (enum): The Priority status of the luggage.
fee (number): The extra kilo fee, fixed at 5.20 and not changeable.
*/
var Priority;
(function (Priority) {
    Priority[Priority["Normal"] = 0] = "Normal";
    Priority[Priority["Priority"] = 1] = "Priority";
    Priority[Priority["Urgent"] = 2] = "Urgent";
})(Priority || (Priority = {}));
/**
 * @class Luggage
 * - An abstract class representing a piece of luggage.
 * ? Contains common properties and methods for all luggage types.
 * ? Cannot be instantiated directly; must be extended by specific luggage types (e.g., RegularLuggage, FragileLuggage).
 */
class Luggage {
    weight;
    description;
    Priority;
    static fee = 5.2;
    static maxWeight = 23;
    // - Constructor
    constructor(weight, description, Priority) {
        this.weight = weight;
        this.description = description;
        this.Priority = Priority;
    }
    // - Getters
    getWeight() {
        return this.weight;
    }
    getDescription() {
        return this.description;
    }
    getPriority() {
        return this.Priority;
    }
    // - Setters
    setWeight(weight) {
        this.weight = weight;
    }
    setDescription(description) {
        this.description = description;
    }
    setPriority(Priority) {
        this.Priority = Priority;
    }
}
/**
 * @class RegularLuggage
 * - A class representing regular luggage, extending the abstract Luggage class.
 * ? Implements the getPrice method based on weight and Priority.
 * ? Regular luggage has no insurance value.
 */
class RegularLuggage extends Luggage {
    constructor(weight, description, Priority) {
        super(weight, description, Priority);
    }
    getPrice() {
        if (this.getWeight() <= Luggage.maxWeight)
            return 0;
        if (this.getPriority() === Priority.Normal)
            return Luggage.fee * (this.getWeight() - Luggage.maxWeight);
        if (this.getPriority() === Priority.Priority)
            return Luggage.fee * 5 * (this.getWeight() - Luggage.maxWeight);
        if (this.getPriority() === Priority.Urgent)
            return Luggage.fee * 10 * (this.getWeight() - Luggage.maxWeight);
        return -1; // Invalid
    }
    toString() {
        return `Regular Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}) \nPrice: $${this.getPrice().toFixed(2)}`;
    }
    getInsuranceValue() {
        return 0; // Regular luggage has no insurance value
    }
    setInsuranceValue(value) {
        return "Insurance is not applicable for regular luggage.";
    }
}
/**
 * @class FragileLuggage
 * - A class representing fragile luggage, extending the abstract Luggage class.
 * ? Implements the getPrice method based on weight, Priority, and insurance value.
 * ? Fragile luggage has an additional insurance value that can be set and retrieved.
 */
class FragileLuggage extends Luggage {
    insurance;
    constructor(weight, description, Priority, insurance) {
        super(weight, description, Priority);
        this.insurance = insurance;
    }
    getPrice() {
        if (this.getPriority() === Priority.Normal)
            return this.insurance;
        if (this.getPriority() === Priority.Priority)
            return Luggage.fee * 5 + this.insurance;
        if (this.getPriority() === Priority.Urgent)
            return Luggage.fee * 10 + this.insurance;
        return -1; // Invalid
    }
    toString() {
        return `Fragile Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}, Insurance: $${this.getInsuranceValue().toFixed(2)}) \nPrice: $${this.getPrice().toFixed(2)}`;
    }
    getInsuranceValue() {
        return this.insurance;
    }
    setInsuranceValue(value) {
        this.insurance = value;
    }
}
class CarryOnLuggage extends Luggage {
    constructor(weight, description, Priority) {
        super(weight, description, Priority);
    }
    getPrice() {
        if (this.getWeight() <= 5)
            return 0; // Carry-on luggage up to 5 kg is free
        return Luggage.fee * 3 * (this.getWeight() - 5); // Extra fee for weight above 5 kg
    }
    toString() {
        return `Carry-On Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}) \nPrice: $${this.getPrice().toFixed(2)}`;
    }
    getInsuranceValue() {
        return 0; // Carry-on luggage has no insurance value
    }
    setInsuranceValue(value) {
        return "Insurance is not applicable for carry-on luggage.";
    }
}
const fragileLuggage = new FragileLuggage(10, "Box with fragile items", Priority.Normal, 100);
const regularLuggage = new RegularLuggage(30, "Luggage full of clothes", Priority.Priority);
const carryOnLuggage = new CarryOnLuggage(6, "Luggage with personal items", Priority.Urgent);
// console.log(fragileLuggage.toString());
// console.log(regularLuggage.toString());
// console.log(carryOnLuggage.toString());
class ListOfLuggages {
    luggages;
    constructor() {
        this.luggages = [];
    }
    insertLuggage(luggage) {
        this.luggages.push(luggage);
    }
    printAllLuggages() {
        for (const luggage of this.luggages) {
            console.log(luggage.toString());
        }
    }
    priceOfEachLuggage() {
        for (const luggage of this.luggages) {
            console.log(`${luggage.getDescription()}: $${luggage.getPrice().toFixed(2)}`);
        }
    }
    totalPrice() {
        let total = this.luggages.reduce((sum, luggage) => sum + luggage.getPrice(), 0);
        console.log(`Total Price: $${total.toFixed(2)}`);
    }
    getFragileLuggageWithInsurance() {
        let totalInsurance = 0;
        for (const luggage of this.luggages) {
            if (luggage instanceof FragileLuggage) {
                totalInsurance += luggage.getInsuranceValue();
            }
        }
        return totalInsurance;
    }
    sortByPrice() {
        this.luggages.sort((a, b) => b.getPrice() - a.getPrice());
    }
    sortByWeight() {
        this.luggages.sort((a, b) => b.getWeight() - a.getWeight());
    }
    sortByPriority() {
        this.luggages.sort((a, b) => b.getPriority() - a.getPriority());
    }
}
// Test the ListOfLuggages class
const luggageList = new ListOfLuggages();
luggageList.insertLuggage(fragileLuggage);
luggageList.insertLuggage(regularLuggage);
luggageList.insertLuggage(carryOnLuggage);
luggageList.printAllLuggages();
console.log('---------------------------------');
luggageList.priceOfEachLuggage();
console.log('---------------------------------');
luggageList.totalPrice();
console.log('---------------------------------');
console.log(`Total Insurance for Fragile Luggage: $${luggageList.getFragileLuggageWithInsurance().toFixed(2)}`);
console.log('---------------------------------');
console.log('Sorting by Price:');
luggageList.sortByPrice();
luggageList.printAllLuggages();
console.log('---------------------------------');
console.log('Sorting by Weight:');
luggageList.sortByWeight();
luggageList.printAllLuggages();
console.log('---------------------------------');
console.log('Sorting by Priority:');
luggageList.sortByPriority();
luggageList.printAllLuggages();
/*
Method to remove a luggage from the list.
Method to update the weight of a luggage.
Method to update the insurance value of fragile luggage.
*/ 

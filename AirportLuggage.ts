/*
Basic Properties
These properties are shared among all luggage types and should be private, protected, and readonly accordingly:

weight (number): The weight of the luggage.
description (string): A description of the luggage.
Priority (enum): The Priority status of the luggage.
fee (number): The extra kilo fee, fixed at 5.20 and not changeable.
*/

enum Priority {
  Normal,
  Priority,
  Urgent,
}

/**
 * @class Luggage
 * - An abstract class representing a piece of luggage.
 * ? Contains common properties and methods for all luggage types.
 * ? Cannot be instantiated directly; must be extended by specific luggage types (e.g., RegularLuggage, FragileLuggage).
 */
abstract class Luggage {
  private weight: number;
  private description: string;
  private Priority: Priority;
  protected static readonly fee: number = 5.2;
  protected static maxWeight: number = 23;

  // - Constructor
  constructor(weight: number, description: string, Priority: Priority) {
    this.weight = weight;
    this.description = description;
    this.Priority = Priority;
  }

  // - Getters
  public getWeight(): number {
    return this.weight;
  }
  public getDescription(): string {
    return this.description;
  }
  public getPriority(): Priority {
    return this.Priority;
  }

  // - Setters
  public setWeight(weight: number): void {
    this.weight = weight;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
  public setPriority(Priority: Priority): void {
    this.Priority = Priority;
  }

  // - Abstract Method
  public abstract getPrice(): number;
  public abstract toString(): string;
  public abstract getInsuranceValue(): number;
  public abstract setInsuranceValue(value: number): void | string;
}

/**
 * @class RegularLuggage
 * - A class representing regular luggage, extending the abstract Luggage class.
 * ? Implements the getPrice method based on weight and Priority.
 * ? Regular luggage has no insurance value.
 */
class RegularLuggage extends Luggage {
  constructor(weight: number, description: string, Priority: Priority) {
    super(weight, description, Priority);
  }

  public getPrice(): number {
    if (this.getWeight() <= Luggage.maxWeight) return 0;

    if (this.getPriority() === Priority.Normal)
      return Luggage.fee * (this.getWeight() - Luggage.maxWeight);
    if (this.getPriority() === Priority.Priority)
      return Luggage.fee * 5 * (this.getWeight() - Luggage.maxWeight);
    if (this.getPriority() === Priority.Urgent)
      return Luggage.fee * 10 * (this.getWeight() - Luggage.maxWeight);

    return -1; // Invalid
  }

  public toString(): string {
    return `Regular Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}) \nPrice: $${this.getPrice().toFixed(2)}`;
  }

  public getInsuranceValue(): number {
    return 0; // Regular luggage has no insurance value
  }

  public setInsuranceValue(value: number): string {
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
  private insurance: number;

  constructor(
    weight: number,
    description: string,
    Priority: Priority,
    insurance: number,
  ) {
    super(weight, description, Priority);
    this.insurance = insurance;
  }

  public getPrice(): number {
    if (this.getPriority() === Priority.Normal) return this.insurance;
    if (this.getPriority() === Priority.Priority)
      return Luggage.fee * 5 + this.insurance;
    if (this.getPriority() === Priority.Urgent)
      return Luggage.fee * 10 + this.insurance;
    return -1; // Invalid
  }

  public toString(): string {
    return `Fragile Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}, Insurance: $${this.getInsuranceValue().toFixed(2)}) \nPrice: $${this.getPrice().toFixed(2)}`;
  }

  public getInsuranceValue(): number {
    return this.insurance;
  }

  public setInsuranceValue(value: number): void {
    this.insurance = value;
  }
}

class CarryOnLuggage extends Luggage {
  constructor(weight: number, description: string, Priority: Priority) {
    super(weight, description, Priority);
  }

  public getPrice(): number {
    if (this.getWeight() <= 5) return 0; // Carry-on luggage up to 5 kg is free

    return Luggage.fee * 3 * (this.getWeight() - 5); // Extra fee for weight above 5 kg
  }

  public toString(): string {
    return `Carry-On Luggage: ${this.getDescription()} (Weight: ${this.getWeight()} kg, Priority: ${Priority[this.getPriority()]}) \nPrice: $${this.getPrice().toFixed(2)}`;
  }

  public getInsuranceValue(): number {
    return 0; // Carry-on luggage has no insurance value
  }

  public setInsuranceValue(value: number): string {
    return "Insurance is not applicable for carry-on luggage.";
  }
}

// > Test cases
const fragileLuggage = new FragileLuggage(
  10,
  "Box with fragile items",
  Priority.Normal,
  100
);
const regularLuggage = new RegularLuggage(
  30,
  "Luggage full of clothes",
  Priority.Priority
);
const carryOnLuggage = new CarryOnLuggage(
  6,
  "Luggage with personal items",
  Priority.Urgent
);

/**
 * @class ListOfLuggages
 * - A class to manage a collection of luggage items.
 * ? Provides methods to insert luggage, print details, calculate prices, and sort the luggage list.
 * ? Can also calculate the total insurance value for fragile luggage.
 */
class ListOfLuggages {
  private luggages: Luggage[];

  constructor() {
    this.luggages = [];
  }

  public insertLuggage(luggage: Luggage): void {
    this.luggages.push(luggage);
  }

  public printAllLuggages(): void {
    for (const luggage of this.luggages) {
      console.log(luggage.toString());
    }
  }

  public priceOfEachLuggage(): void {
    for (const luggage of this.luggages) {
      console.log(
        `${luggage.getDescription()}: $${luggage.getPrice().toFixed(2)}`
      );
    }
  }

  public totalPrice(): void {
    let total = this.luggages.reduce((sum, luggage) => sum + luggage.getPrice(), 0);
    console.log(`Total Price: $${total.toFixed(2)}`);
  }

  public getFragileLuggageWithInsurance(): number {
    let totalInsurance = 0;
    for (const luggage of this.luggages) {
      if (luggage instanceof FragileLuggage) {
        totalInsurance += luggage.getInsuranceValue();
      }
    }
    return totalInsurance;
  }

  public sortByPrice() : void {
    this.luggages.sort((a, b) => b.getPrice() - a.getPrice());
  }

  public sortByWeight() : void {
    this.luggages.sort((a, b) => b.getWeight() - a.getWeight());
  }

  public sortByPriority() : void {
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
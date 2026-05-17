import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface RecipientProps {
  name: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get street() {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
  }

  get number() {
    return this.props.number;
  }

  set number(number: string) {
    this.props.number = number;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
  }

  get latitude() {
    return this.props.latitude;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id);
    return recipient;
  }
}

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "products" })
export class Product {


	@ApiProperty({
		example: "08e9a54c-f485-4f6c-87ca-8f18e1231954",
		description: "Product ID",
		uniqueItems: true
	})
	@PrimaryGeneratedColumn( "uuid" )
	id: string;

	@ApiProperty({
		example: "T-shirt Teslo",
		description: "Product Title",
		uniqueItems: true
	})
	@Column( "text", {
		unique: true
	})
	title: string;

	@ApiProperty({
		example: 0,
		description: "Product Price",
	})
	@Column( "float", {
		default: 0
	})
	price: number;

	@ApiProperty({
		example: "Eiusmod ad ad exercitation laboris elit consectetur officia aliquip.",
		description: "Product Description",
		default: null
	})
	@Column({
		type: "text",
		nullable: true
	})
	description: string;

	@ApiProperty({
		example: "T_Shirt_Teslo",
		description: "Product SLUG - for SEO",
		uniqueItems: true
	})
	@Column({
		type: "text",
		unique: true
	})
	slug: string;

	@ApiProperty({
		example: 10,
		description: "Product Stock",
		default: 0
	})
	@Column( "int", {
		default: 0
	})
	stock: number;

	@ApiProperty({
		example: [ "M", "XL", "XS"],
		description: "Product sizes",
	})
	@Column( "text", {
		array: true
	})
	sizes: string[];

	@ApiProperty({
		example: "Unisex",
		description: "Product gender",
	})
	@Column( "text" )
	gender: string;

	@ApiProperty()
	@Column({
		type: "text",
		array: true,
		default: [],
	})
	tags: string[];

	@ApiProperty({
		example: [ "img1.jpg", "img2.png" ],
		description: "Product images",
	})
	@OneToMany(
		() => ProductImage,
		( productImage ) => productImage.product,
		{ cascade: true, eager: true }
	)
	images?: ProductImage[];

	@ManyToOne(
		() => User,
		( user ) => user.product,
		{ eager: true }
	)
	user: User;

	@BeforeInsert()
	checkSlugInsert() {

		if ( !this.slug )
			this.slug = this.title

		this.slug = this.slug
			.toLowerCase()
			.replaceAll( " ", "_" )
			.replaceAll( "'", "" )
	}

	@BeforeUpdate()
	checkSlugUpdate() {

		this.slug = this.slug
			.toLowerCase()
			.replaceAll( " ", "_" )
			.replaceAll( "'", "" )
	}
}

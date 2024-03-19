import { Fixture, Generator } from "zod-fixture";
import "./App.css";
import { ZodNumber, ZodObject, ZodString, z } from "zod";

function test() {
  // example 1

  const totalVisitsGenerator = Generator({
    schema: ZodNumber,
    filter: ({ context }) => context.path.at(-1) === "totalVisits",
    /**
     * The `context` provides a path to the current field
     *
     * {
     *   totalVisits: ...,
     *   nested: {
     *     totalVisits: ...,
     *   }
     * }
     *
     * Would match twice with the following paths:
     *   ['totalVisits']
     *   ['nested', 'totalVisits']
     */

    // returns a more realistic number of visits.
    output: ({ transform }) => transform.utils.random.int({ min: 0, max: 25 }),
  });

  const addressGenerator = Generator({
    schema: ZodObject,
    filter: ({ context }) => context.path.at(-1) === "address",
    // returns a custom address object
    output: () => ({
      street: "My Street",
      city: "My City",
      state: "My State",
    }),
  });

  const personSchema = z.object({
    name: z.string(),
    birthday: z.date(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
    }),
    pets: z.array(z.object({ name: z.string(), breed: z.string() })),
    totalVisits: z.number().int().positive(),
  });

  const fixture = new Fixture({ seed: 38 }).extend([
    addressGenerator,
    totalVisitsGenerator,
  ]);
  const person = fixture.fromSchema(personSchema);

  // example 2

  // this is a custom zod type
  const pxSchema = z.custom<`${number}px`>((val) => {
    return /^\d+px$/.test(val as string);
  });

  const StringGenerator = Generator({
    schema: ZodString,
    output: () => "John Doe",
  });

  const PixelGenerator = Generator({
    schema: pxSchema,
    output: () => "100px",
  });

  const developerSchema = z.object({
    name: z.string().max(10),
    resolution: z.object({
      height: pxSchema,
      width: pxSchema,
    }),
  });

  const fixture2 = new Fixture({ seed: 7 }).extend([
    PixelGenerator,
    StringGenerator,
  ]);
  const developer = fixture2.fromSchema(developerSchema);

  return JSON.stringify([person, developer], null, 2);
}

function App() {
  return <pre>{test()}</pre>;
}

export default App;

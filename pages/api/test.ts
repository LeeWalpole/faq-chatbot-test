// pages/api/test.ts

export default (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
    res.status(200).json({ message: 'This is a test API route' });
  };
  
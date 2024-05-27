export function isEmailValid(email: string): RegExpMatchArray | null {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return email.match(regex);
}

export function isPasswordValid(password: string): RegExpMatchArray | null {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
  return password.match(regex);
}

export function isUsernameValid(username: string): RegExpMatchArray | null {
  const regex = /^[A-Za-z0-9]{6,}$/;
  return username.match(regex);
}

export function isUserAgeBetween6And130(date: any): boolean {
  const givenDate = new Date(date);
  const currentDate = new Date();

  const sixYearsAgo = new Date(
    currentDate.getFullYear() - 6,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const oneHundredThirtyYearsAgo = new Date(
    currentDate.getFullYear() - 130,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return givenDate <= sixYearsAgo && givenDate >= oneHundredThirtyYearsAgo;
}

export function isDateBefore(firstDate: Date, secondDate: Date): boolean {
  return firstDate < secondDate;
}

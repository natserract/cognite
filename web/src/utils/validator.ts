export function passwordValidator(pass: string) {
  const check = /^(?=\D*\d)(?=.*[!.@#\$%\^&\*])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/.test(pass);

  if (!check) {
    return {
      strong: true
    }
  } else {
    return null
  }
}

export function passwordMatching(pass: string, nextPass: string) {
  if (pass !== nextPass) {
    return {
      confirmPasswordValidator: true
    }
  } else {
    return null
  }
}

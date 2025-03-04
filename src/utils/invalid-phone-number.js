function isValidPhoneNumber(phone) {
  const phoneRegex =
    /^\+?[0-9]{1,3}?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export default isValidPhoneNumber;

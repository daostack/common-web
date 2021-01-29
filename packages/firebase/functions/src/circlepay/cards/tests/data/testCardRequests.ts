export const validCreateCardRequest = {
  keyId: 'key1',
  encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tClZlcnNpb246IGZhc3Qtb3BlbnBncAoKd2NCTUEwWFdTRmxGUnBWaEFRZ0FOZ1ZCNGFYMWphKzBzUjlROXMxQjgyeVlkMVpzcDRydkhKK2NLQ0Jwb3o0TwpaNUJrd0tqTUIvQXhzNHJ6UHhmMW5pZ005Wmlpenh0ejJkamJMSVBGUG5HVlNiUmoxTnpWTXBIdElKS2haZWhYCk5vT0lPbXZJRzN4TEhCQzB1cm8vM29wY2ZhVkd4V1MrNE02L0poOGI4OVo4NjdvZVptTkU0NEF4TE1QZGJzRGYKQWV0bGYraTZ1R01mSGFxcnUwWGVsRmx2Wmt4UW91VEVLaGtGL01IdzNlU0c2S0dUS0QxdGhrWTBNZ2o1VWZqKwpIQkl0bzhSVG1XR2lxK2dWWTgxZnB1bWU5T3hyVVFWZmoxOEp3Z3VweUhlMkJNR2x4WFE1UE43MWV0eXMvdHdhClJNNFRlc2NQcVdicHlCTlYzaTFuTHdYUmk3RWk5TXFHT2ZWdGlwN3FoZExnQWVTVU9PWGJ2K1VTOUVPQ0pMYVEKZnFFdjRlWmo0SUxnWmVFRm91RFM0b05TSlZ2Z1MrWG5EblpyYURnajRoOG16L1dNMnRYNVFLNkxKanNSY3M4cgpHZ2hvOG1IK09lQ3A0eExhUmZuQnRGN3g0UEhnY2VEUzVPNzc5Vng4NlFZRjNhZFB0YTZkQWQ3aTg0b1hTdUZGClBBQT0KPWE2VkIKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo=',
  billingDetails: {
    name: 'Tester Tester Tester Tester',
    city: 'Metropolis',
    country: 'US',
    line1: '221B Baker Street',
    postalCode: '31415PI',
    district: 'TX'
  },
  expMonth: 11,
  expYear: 2024
};

export const invalidCreateCardRequest_MissingKeyId = {
  encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tClZlcnNpb246IGZhc3Qtb3BlbnBncAoKd2NCTUEwWFdTRmxGUnBWaEFRZ0FOZ1ZCNGFYMWphKzBzUjlROXMxQjgyeVlkMVpzcDRydkhKK2NLQ0Jwb3o0TwpaNUJrd0tqTUIvQXhzNHJ6UHhmMW5pZ005Wmlpenh0ejJkamJMSVBGUG5HVlNiUmoxTnpWTXBIdElKS2haZWhYCk5vT0lPbXZJRzN4TEhCQzB1cm8vM29wY2ZhVkd4V1MrNE02L0poOGI4OVo4NjdvZVptTkU0NEF4TE1QZGJzRGYKQWV0bGYraTZ1R01mSGFxcnUwWGVsRmx2Wmt4UW91VEVLaGtGL01IdzNlU0c2S0dUS0QxdGhrWTBNZ2o1VWZqKwpIQkl0bzhSVG1XR2lxK2dWWTgxZnB1bWU5T3hyVVFWZmoxOEp3Z3VweUhlMkJNR2x4WFE1UE43MWV0eXMvdHdhClJNNFRlc2NQcVdicHlCTlYzaTFuTHdYUmk3RWk5TXFHT2ZWdGlwN3FoZExnQWVTVU9PWGJ2K1VTOUVPQ0pMYVEKZnFFdjRlWmo0SUxnWmVFRm91RFM0b05TSlZ2Z1MrWG5EblpyYURnajRoOG16L1dNMnRYNVFLNkxKanNSY3M4cgpHZ2hvOG1IK09lQ3A0eExhUmZuQnRGN3g0UEhnY2VEUzVPNzc5Vng4NlFZRjNhZFB0YTZkQWQ3aTg0b1hTdUZGClBBQT0KPWE2VkIKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo=',
  billingDetails: {
    name: 'Tester Tester Tester Tester',
    city: 'Metropolis',
    country: 'US',
    line1: '221B Baker Street',
    postalCode: '31415PI',
    district: 'TX'
  },
  expMonth: 11,
  expYear: 2024
}

export const invalidCreateCardRequest_PassedDate = {
  keyId: 'key1',
  encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tClZlcnNpb246IGZhc3Qtb3BlbnBncAoKd2NCTUEwWFdTRmxGUnBWaEFRZ0FOZ1ZCNGFYMWphKzBzUjlROXMxQjgyeVlkMVpzcDRydkhKK2NLQ0Jwb3o0TwpaNUJrd0tqTUIvQXhzNHJ6UHhmMW5pZ005Wmlpenh0ejJkamJMSVBGUG5HVlNiUmoxTnpWTXBIdElKS2haZWhYCk5vT0lPbXZJRzN4TEhCQzB1cm8vM29wY2ZhVkd4V1MrNE02L0poOGI4OVo4NjdvZVptTkU0NEF4TE1QZGJzRGYKQWV0bGYraTZ1R01mSGFxcnUwWGVsRmx2Wmt4UW91VEVLaGtGL01IdzNlU0c2S0dUS0QxdGhrWTBNZ2o1VWZqKwpIQkl0bzhSVG1XR2lxK2dWWTgxZnB1bWU5T3hyVVFWZmoxOEp3Z3VweUhlMkJNR2x4WFE1UE43MWV0eXMvdHdhClJNNFRlc2NQcVdicHlCTlYzaTFuTHdYUmk3RWk5TXFHT2ZWdGlwN3FoZExnQWVTVU9PWGJ2K1VTOUVPQ0pMYVEKZnFFdjRlWmo0SUxnWmVFRm91RFM0b05TSlZ2Z1MrWG5EblpyYURnajRoOG16L1dNMnRYNVFLNkxKanNSY3M4cgpHZ2hvOG1IK09lQ3A0eExhUmZuQnRGN3g0UEhnY2VEUzVPNzc5Vng4NlFZRjNhZFB0YTZkQWQ3aTg0b1hTdUZGClBBQT0KPWE2VkIKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo=',
  billingDetails: {
    name: 'Tester Tester Tester Tester',
    city: 'Metropolis',
    country: 'US',
    line1: '221B Baker Street',
    postalCode: '31415PI',
    district: 'TX'
  },
  expMonth: 11,
  expYear: 2020
}
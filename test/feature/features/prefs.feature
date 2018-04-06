Feature: Init
  I should be able to change my cli preferences

  Scenario: Prefs command to change language using flags
    Given I have already logged in
    When I run prefs command with 'changelang' using 'flags'
    Then I should be able to change the submission language

  Scenario: Prefs command to change language using prompt
    Given I have already logged in
    When I run prefs command with 'changelang' using 'prompt'
    Then I should be able to change the submission language

  Scenario: Prefs command to change language for invalid language
    Given I have already logged in
    When I run prefs command with changelang with invalid language
    Then I should be displayed an error message for invalid language

  Scenario: Prefs command to change server using flags
    Given I have already logged in
    When I run prefs command with 'changeserver' using 'flags'
    Then I should be able to change the submission server

  Scenario: Prefs command with invalid host
    Given I have already logged in
    When I run change server with invalid host
    Then I should be displayed an error message for invalid host

  Scenario: Prefs command with invalid port
    Given I have already logged in
    When I run change server with invalid port
    Then I should be displayed an error message for invalid port


  Scenario: Prefs command to change server using prompt
    Given I have already logged in
    When I run prefs command with 'changeserver' using 'prompt'
    Then I should be able to change the submission server

  Scenario: Prefs command to show preferences
    Given I have already logged in
    When I run prefs command with show
    Then I should be able to see the preferences
